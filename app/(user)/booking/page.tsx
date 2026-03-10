'use client';

import { useState, useMemo, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaUser, FaPhone, FaEnvelope, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { formatPhoneInput, onlyDigits } from '@/lib/validation';

interface Service {
  id: string;
  name: string;
  category: string;
  duration: string;
  price: number;
  description?: string;
}

interface Staff {
  id: string;
  name: string;
  specialty: string;
  avatar?: string;
  categories: string;
  workdayStart?: string;
  workdayEnd?: string;
  weekendStart?: string;
  weekendEnd?: string;
  workingDays?: string;
}

interface SiteSettings {
  workdayStart?: string;
  workdayEnd?: string;
  weekendStart?: string;
  weekendEnd?: string;
}

const SLOT_INTERVAL_MINUTES = 30;

const parseDurationMinutes = (duration: string | number | undefined): number => {
  if (typeof duration === 'number') return duration;
  if (!duration) return 30;
  const parsed = parseInt(String(duration), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 30;
};

const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const minutesToTime = (total: number): string => {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const isWeekendDate = (date: string): boolean => {
  const day = new Date(`${date}T00:00:00`).getDay();
  return day === 0 || day === 6;
};

const rangesOverlap = (aStart: number, aEnd: number, bStart: number, bEnd: number): boolean => {
  return aStart < bEnd && bStart < aEnd;
};

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [existingAppointments, setExistingAppointments] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({});
  
  const [bookingData, setBookingData] = useState({
    service: '',
    staff: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  // Verileri API'den çek
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, staffRes, settingsRes] = await Promise.all([
          fetch('/api/services', { cache: 'no-store' }),
          fetch('/api/staff', { cache: 'no-store' }),
          fetch('/api/settings', { cache: 'no-store' }),
        ]);

        const servicesData = await servicesRes.json();
        const staffData = await staffRes.json();
        const settingsData = await settingsRes.json();

        setServices(servicesData);
        setStaff(staffData);
        setSiteSettings(settingsData || {});
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
      }
    };

    fetchData();
  }, []);

  // Seçilen personel ve tarihe göre randevuları yükle
  useEffect(() => {
    if (bookingData.staff && bookingData.date) {
      const fetchAppointments = async () => {
        try {
          const res = await fetch(`/api/appointments?staffId=${bookingData.staff}&date=${bookingData.date}`, { cache: 'no-store' });
          const data = await res.json();
          setExistingAppointments(data);
        } catch (error) {
          console.error('Randevu yükleme hatası:', error);
        }
      };

      fetchAppointments();
    }
  }, [bookingData.staff, bookingData.date]);

  // Seçilen hizmete göre uygun uzmanları filtrele
  const availableStaff = useMemo(() => {
    if (!bookingData.service) return [];
    
    const selectedService = services.find(s => s.id === bookingData.service);
    if (!selectedService) return [];

    return staff.filter(person => {
      try {
        const categories = JSON.parse(person.categories);
        return categories.includes(selectedService.category);
      } catch {
        return false;
      }
    });
  }, [bookingData.service, services, staff]);

  // Seçilen uzman, tarih ve saate göre uygun saatleri filtrele
  const availableTimes = useMemo(() => {
    if (!bookingData.staff || !bookingData.date || !bookingData.service) return [];

    const selectedService = services.find(s => s.id === bookingData.service);
    const selectedDuration = parseDurationMinutes(selectedService?.duration);
    const selectedStaffMember = staff.find(s => s.id === bookingData.staff);

    // Seçilen personelin çalışma saatlerini kullan
    const weekend = isWeekendDate(bookingData.date);
    const startTime = weekend
      ? (selectedStaffMember?.weekendStart || siteSettings.weekendStart || '10:00')
      : (selectedStaffMember?.workdayStart || siteSettings.workdayStart || '09:00');
    const endTime = weekend
      ? (selectedStaffMember?.weekendEnd || siteSettings.weekendEnd || '18:00')
      : (selectedStaffMember?.workdayEnd || siteSettings.workdayEnd || '19:00');

    // Personelin çalışma günlerini kontrol et
    if (selectedStaffMember?.workingDays) {
      try {
        const workingDays = JSON.parse(selectedStaffMember.workingDays);
        const selectedDate = new Date(`${bookingData.date}T00:00:00`);
        const dayOfWeek = selectedDate.getDay(); // 0 = Pazar, 1 = Pazartesi, ..., 6 = Cumartesi
        
        if (!workingDays.includes(dayOfWeek)) {
          // Personel bu günü çalışmıyor
          return [];
        }
      } catch (e) {
        console.error('Çalışma günleri parse hatası:', e);
      }
    }

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    const now = new Date();
    const selectedDateObj = new Date(`${bookingData.date}T00:00:00`);
    const isToday =
      selectedDateObj.getFullYear() === now.getFullYear() &&
      selectedDateObj.getMonth() === now.getMonth() &&
      selectedDateObj.getDate() === now.getDate();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const appointmentBlocks = existingAppointments
      .filter((apt) => apt.status !== 'cancelled' && apt.status !== 'rejected')
      .map((apt) => {
        const blockStart = timeToMinutes(apt.time);
        const blockDuration = parseDurationMinutes(apt.service?.duration);
        return { start: blockStart, end: blockStart + blockDuration };
      });

    const slots: string[] = [];
    for (let slotStart = startMinutes; slotStart + selectedDuration <= endMinutes; slotStart += SLOT_INTERVAL_MINUTES) {
      if (isToday && slotStart <= nowMinutes) {
        continue;
      }

      const slotEnd = slotStart + selectedDuration;
      const hasConflict = appointmentBlocks.some((block) =>
        rangesOverlap(slotStart, slotEnd, block.start, block.end)
      );

      if (!hasConflict) {
        slots.push(minutesToTime(slotStart));
      }
    }

    return slots;
  }, [bookingData.staff, bookingData.date, bookingData.service, existingAppointments, services, staff, siteSettings]);

  useEffect(() => {
    if (bookingData.time && !availableTimes.includes(bookingData.time)) {
      setBookingData(prev => ({ ...prev, time: '' }));
    }
  }, [availableTimes, bookingData.time]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      // Adım geçişlerinde validasyon
      if (step === 1 && !bookingData.service) {
        alert('Lütfen bir hizmet seçin');
        return;
      }
      if (step === 2 && (!bookingData.staff || !bookingData.date || !bookingData.time)) {
        alert('Lütfen personel, tarih ve saat seçin');
        return;
      }
      setStep(step + 1);
    } else if (step === 3) {
      // Randevu oluşturma işlemi - API çağrısı (Artık 3. adımdan 4. adıma geçerken yapıyoruz)
      setLoading(true);
      try {
        if (onlyDigits(bookingData.phone).length < 10) {
          throw new Error('Geçerli bir telefon numarası giriniz');
        }

        const response = await fetch('/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            serviceId: bookingData.service,
            staffId: bookingData.staff,
            date: bookingData.date,
            time: bookingData.time,
            customerName: bookingData.name,
            customerPhone: bookingData.phone,
            customerEmail: bookingData.email,
            notes: bookingData.notes,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Randevu oluşturulamadı');
        }

        const appointment = await response.json();
        console.log('Randevu başarıyla oluşturuldu:', appointment);
        
        // Başarılı olduğunda onay sayfasına geç
        setStep(4);
      } catch (error: any) {
        console.error('Randevu oluşturma hatası:', error);
        alert(error.message || 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }
  };

  // Personel seçiminde tarihi ve saati sıfırla
  const handleStaffChange = (staffId: string) => {
    setBookingData({ ...bookingData, staff: staffId, time: '' });
  };

  // Tarih seçiminde saati sıfırla
  const handleDateChange = (date: string) => {
    setBookingData({ ...bookingData, date: date, time: '' });
  };

  return (
    <div>
      {/* Hero Section with Animated Video Background */}
      <section className="bg-[#0a0a0a] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-25"
          >
            <source src="/videos/AQNfdtXqhwhhJ_GuOBXThTauVGnpw4cSzoy3Vrkv2GdGE7CCRCu14-EbrHTY2Clw3TRiCIoA2fok6umBjoy9KuYtu1Nq-cvobDe9V0U.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-[#0a0a0a]"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#C5A059]/20 backdrop-blur-sm rounded-full border border-[#C5A059]/30 mb-6">
            <FaCalendarAlt className="text-[#C5A059]" />
            <span className="text-[#C5A059] font-semibold">Kolay Randevu Sistemi</span>
          </div>
          <h1 className="text-6xl font-bold mb-4">Online Randevu</h1>
          <p className="text-2xl text-gray-300 leading-relaxed">Kolayca randevu oluşturun, zamanınızı planlayın</p>
        </div>
      </section>

      {/* Booking Steps */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              {[
                { num: 1, title: 'Hizmet' },
                { num: 2, title: 'Tarih & Saat' },
                { num: 3, title: 'Bilgiler' },
                { num: 4, title: 'Onay' }
              ].map((s) => (
                <div key={s.num} className="flex-1 relative">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-all duration-300 ${
                        step >= s.num
                          ? 'bg-[#C5A059] text-black shadow-lg shadow-[#C5A059]/50'
                          : 'bg-[#1a1a1a] text-gray-500 border border-[#C5A059]/30'
                      }`}
                    >
                      {step > s.num ? <FaCheckCircle /> : s.num}
                    </div>
                    <span className={`text-sm font-semibold ${step >= s.num ? 'text-[#C5A059]' : 'text-gray-500'}`}>
                      {s.title}
                    </span>
                  </div>
                  {s.num < 4 && (
                    <div
                      className={`absolute top-6 left-1/2 w-full h-1 transition-all duration-300 ${
                        step > s.num ? 'bg-[#C5A059]' : 'bg-[#1a1a1a]'
                      }`}
                      style={{ zIndex: -1 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-[#1a1a1a] rounded-2xl shadow-2xl p-8 border border-[#C5A059]/20">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Service Selection */}
              {step === 1 && (
                <div className="animate-fadeIn">
                  <h2 className="text-2xl font-bold text-white mb-6">Hizmet Seçin</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                    {services.map((service) => (
                      <label
                        key={service.id}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                          bookingData.service === service.id
                            ? 'border-[#C5A059] bg-[#C5A059]/10'
                            : 'border-[#C5A059]/30 hover:border-[#C5A059]/50 bg-[#0a0a0a]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="service"
                          value={service.id}
                          checked={bookingData.service === service.id}
                          onChange={(e) => setBookingData({ ...bookingData, service: e.target.value, staff: '', date: '', time: '' })}
                          className="sr-only"
                        />
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-white">{service.name}</h3>
                            <p className="text-sm text-gray-400">{service.category}</p>
                            <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <FaClock className="text-[#C5A059]" />
                                {service.duration}
                              </span>
                              <span className="font-semibold text-[#C5A059]">{service.price}₺</span>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Date, Time & Staff */}
              {step === 2 && (
                <div className="animate-fadeIn space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Tarih, Saat ve Personel Seçin</h2>
                  
                  {/* Uzman Seçimi */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Hizmet İçin Uygun Uzmanlar
                      <span className="ml-2 text-[#C5A059] text-xs">
                        ({availableStaff.length} uzman)
                      </span>
                    </label>
                    {availableStaff.length === 0 ? (
                      <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-xl p-4 text-[#C5A059] text-sm">
                        <FaExclamationCircle className="inline mr-2" />
                        Lütfen önce bir hizmet seçin.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {availableStaff.map((person) => (
                          <label
                            key={person.id}
                            className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                              bookingData.staff === person.id
                                ? 'border-[#C5A059] bg-[#C5A059]/10'
                                : 'border-[#C5A059]/30 hover:border-[#C5A059]/50 bg-[#0a0a0a]'
                            }`}
                          >
                            <input
                              type="radio"
                              name="staff"
                              value={person.id}
                              checked={bookingData.staff === person.id}
                              onChange={(e) => handleStaffChange(e.target.value)}
                              className="sr-only"
                            />
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-[#C5A059] to-[#ad8345] rounded-full flex items-center justify-center text-black font-bold">
                                {person.avatar || person.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-bold text-white">{person.name}</p>
                                <p className="text-sm text-gray-400">{person.specialty}</p>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tarih Seçimi */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Tarih</label>
                    <input
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => handleDateChange(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      disabled={!bookingData.staff}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none disabled:bg-gray-100 disabled:cursor-not-allowed text-black placeholder-gray-400"
                    />
                    {!bookingData.staff && (
                      <p className="text-sm text-gray-400 mt-2">Önce bir uzman seçin</p>
                    )}
                  </div>

                  {/* Saat Seçimi */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Uygun Saatler
                      {bookingData.staff && bookingData.date && (
                        <span className="ml-2 text-[#C5A059] text-xs">
                          ({availableTimes.length} saat müsait)
                        </span>
                      )}
                    </label>
                    {!bookingData.staff || !bookingData.date ? (
                      <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-xl p-4 text-[#C5A059] text-sm">
                        <FaExclamationCircle className="inline mr-2" />
                        Uygun saatleri görmek için önce uzman ve tarih seçin
                      </div>
                    ) : availableTimes.length === 0 ? (
                      <div className="bg-red-950/50 border border-red-900/50 rounded-xl p-4 text-red-400 text-sm">
                        <FaExclamationCircle className="inline mr-2" />
                        Seçtiğiniz uzman bu tarihte müsait değil. Lütfen başka bir tarih seçin.
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                        {availableTimes.map((time) => (
                          <label
                            key={time}
                            className={`cursor-pointer p-3 rounded-lg border-2 text-center font-semibold transition-all duration-300 ${
                              bookingData.time === time
                                ? 'border-[#C5A059] bg-[#C5A059] text-black'
                                : 'border-[#C5A059]/20 hover:border-[#C5A059]/40 text-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="time"
                              value={time}
                              checked={bookingData.time === time}
                              onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                              className="sr-only"
                            />
                            {time}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Contact Information */}
              {step === 3 && (
                <div className="animate-fadeIn space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">İletişim Bilgileriniz</h2>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      <FaUser className="inline mr-2" />
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      value={bookingData.name}
                      onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                      required
                      placeholder="Adınız Soyadınız"
                      className="w-full px-4 py-3 bg-[#0a0a0a] border-2 border-[#C5A059]/30 rounded-xl focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      <FaPhone className="inline mr-2" />
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={bookingData.phone}
                        onChange={(e) => setBookingData({ ...bookingData, phone: formatPhoneInput(e.target.value) })}
                        inputMode="numeric"
                        maxLength={14}
                      required
                      placeholder="0500 000 00 00"
                      className="w-full px-4 py-3 bg-[#0a0a0a] border-2 border-[#C5A059]/30 rounded-xl focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      <FaEnvelope className="inline mr-2" />
                      E-posta
                    </label>
                    <input
                      type="email"
                      value={bookingData.email}
                      onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                      required
                      placeholder="email@ornek.com"
                      className="w-full px-4 py-3 bg-[#0a0a0a] border-2 border-[#C5A059]/30 rounded-xl focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Notlar (Opsiyonel)</label>
                    <textarea
                      value={bookingData.notes}
                      onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                      placeholder="Eklemek istediğiniz notlar..."
                      rows={4}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border-2 border-[#C5A059]/30 rounded-xl focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none text-white placeholder-gray-500"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <div className="animate-fadeIn">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-[#C5A059] rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaCheckCircle className="text-black text-4xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Randevunuz İşleme Alındı!</h2>
                    <p className="text-gray-400">Onay e-postası kısa süre içinde tarafınıza gönderilecektir</p>
                  </div>

                  <div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4 border border-[#C5A059]/30">
                    <div className="flex items-start justify-between border-b border-[#C5A059]/20 pb-3">
                      <span className="text-gray-400 font-semibold">Hizmet:</span>
                      <span className="text-white font-bold">{services.find(s => s.id === bookingData.service)?.name}</span>
                    </div>
                    <div className="flex items-start justify-between border-b border-[#C5A059]/20 pb-3">
                      <span className="text-gray-400 font-semibold">Personel:</span>
                      <span className="text-white font-bold">{staff.find(s => s.id === bookingData.staff)?.name}</span>
                    </div>
                    <div className="flex items-start justify-between border-b border-[#C5A059]/20 pb-3">
                      <span className="text-gray-400 font-semibold">Tarih:</span>
                      <span className="text-white font-bold" suppressHydrationWarning>{new Date(bookingData.date).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <div className="flex items-start justify-between border-b border-[#C5A059]/20 pb-3">
                      <span className="text-gray-400 font-semibold">Saat:</span>
                      <span className="text-white font-bold">{bookingData.time}</span>
                    </div>
                    <div className="flex items-start justify-between border-b border-[#C5A059]/20 pb-3">
                      <span className="text-gray-400 font-semibold">Ad Soyad:</span>
                      <span className="text-white font-bold">{bookingData.name}</span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-gray-400 font-semibold">Telefon:</span>
                      <span className="text-white font-bold">{bookingData.phone}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-[#C5A059]/10 rounded-xl border border-[#C5A059]/30">
                    <p className="text-sm text-[#C5A059]">
                      <strong>Bilgilendirme:</strong> Randevunuz işleme alınmıştır. Onay e-postası e-posta adresinize gönderilmiştir. Randevunuz onaylandığında ayrıca bilgilendirileceksiniz.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                {step > 1 && step < 4 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex-1 px-6 py-3 border-2 border-[#C5A059]/30 rounded-xl font-semibold text-white hover:bg-[#1a1a1a] transition-colors"
                  >
                    Geri
                  </button>
                )}
                {step < 4 ? (
                  <button
                    type="submit"
                    disabled={
                      (step === 1 && !bookingData.service) ||
                      (step === 2 && (!bookingData.staff || !bookingData.date || !bookingData.time)) ||
                      (step === 3 && (!bookingData.name || !bookingData.phone || !bookingData.email))
                    }
                    className="flex-1 px-6 py-3 bg-[#C5A059] text-black rounded-xl font-semibold hover:shadow-lg hover:shadow-[#C5A059]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {step === 3 ? 'Randevuyu Onayla' : 'Devam Et'}
                  </button>
                ) : (
                  <a
                    href="/"
                    className="flex-1 px-6 py-3 bg-[#C5A059] text-black rounded-xl font-semibold hover:shadow-lg hover:shadow-[#C5A059]/50 transition-all duration-300 text-center"
                  >
                    Ana Sayfaya Dön
                  </a>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
