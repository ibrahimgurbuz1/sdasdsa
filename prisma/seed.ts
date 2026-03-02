import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Veritabanı seed işlemi başlatılıyor...');

  // Admin kullanıcı oluştur
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@demir.com' },
    update: {},
    create: {
      email: 'admin@demir.com',
      password: hashedPassword,
      name: 'Admin Kullanıcı',
      role: 'Salon Müdürü',
    },
  });
  console.log('✅ Admin kullanıcı oluşturuldu:', admin.email);

  // Personel ekle
  const staffData = [
    { name: 'Elif Kaya', email: 'elif@demir.com', phone: '0532 111 1111', specialty: 'Saç Uzmanı', avatar: 'EK', categories: JSON.stringify(['Saç']) },
    { name: 'Ayşe Demir', email: 'ayse@demir.com', phone: '0532 222 2222', specialty: 'Saç Uzmanı', avatar: 'AD', categories: JSON.stringify(['Saç']) },
    { name: 'Fatma Şahin', email: 'fatma@demir.com', phone: '0532 333 3333', specialty: 'Cilt Uzmanı', avatar: 'FŞ', categories: JSON.stringify(['Cilt']) },
    { name: 'Zeynep Yıldız', email: 'zeynep@demir.com', phone: '0532 444 4444', specialty: 'Tırnak Uzmanı', avatar: 'ZY', categories: JSON.stringify(['Tırnak']) },
    { name: 'Merve Öztürk', email: 'merve@demir.com', phone: '0532 555 5555', specialty: 'Makyöz', avatar: 'MÖ', categories: JSON.stringify(['Makyaj', 'Kirpik']) },
    { name: 'Selin Arslan', email: 'selin@demir.com', phone: '0532 666 6666', specialty: 'Masaj Terapisti', avatar: 'SA', categories: JSON.stringify(['Masaj']) },
  ];

  for (const staff of staffData) {
    await prisma.staff.upsert({
      where: { email: staff.email },
      update: {},
      create: staff,
    });
  }
  console.log(`✅ ${staffData.length} personel eklendi`);

  // Hizmetler ekle
  const servicesData = [
    { name: 'Kadın Saç Kesimi', category: 'Saç', duration: '45 dk', price: 350, description: 'Profesyonel kadın saç kesimi' },
    { name: 'Saç Boyama', category: 'Saç', duration: '2 saat', price: 1200, description: 'Tam saç boyama işlemi' },
    { name: 'Röfle/Balyaj', category: 'Saç', duration: '3 saat', price: 1500, description: 'Röfle veya balyaj uygulaması' },
    { name: 'Keratin Bakımı', category: 'Saç', duration: '3 saat', price: 2500, description: 'Profesyonel keratin bakımı' },
    { name: 'Cilt Bakımı', category: 'Cilt', duration: '60 dk', price: 800, description: 'Temel cilt bakımı' },
    { name: 'HydraFacial', category: 'Cilt', duration: '60 dk', price: 2000, description: 'Hydrafacial cilt bakımı' },
    { name: 'Altın Maske', category: 'Cilt', duration: '45 dk', price: 1500, description: '24 ayar altın maske uygulaması' },
    { name: 'Manikür', category: 'Tırnak', duration: '30 dk', price: 250, description: 'Klasik manikür' },
    { name: 'Pedikür', category: 'Tırnak', duration: '45 dk', price: 300, description: 'Klasik pedikür' },
    { name: 'Kalıcı Oje', category: 'Tırnak', duration: '45 dk', price: 400, description: 'Kalıcı oje uygulaması' },
    { name: 'Protez Tırnak', category: 'Tırnak', duration: '90 dk', price: 600, description: 'Protez tırnak uygulaması' },
    { name: 'Gelin Makyajı', category: 'Makyaj', duration: '2 saat', price: 3000, description: 'Özel gelin makyajı' },
    { name: 'Günlük Makyaj', category: 'Makyaj', duration: '45 dk', price: 500, description: 'Doğal günlük makyaj' },
    { name: 'İpek Kirpik', category: 'Kirpik', duration: '90 dk', price: 1200, description: 'İpek kirpik uygulaması' },
    { name: 'Kirpik Lifting', category: 'Kirpik', duration: '60 dk', price: 800, description: 'Kirpik lifting ve boyama' },
    { name: 'İsveç Masajı', category: 'Masaj', duration: '60 dk', price: 750, description: 'Rahatlatıcı İsveç masajı' },
    { name: 'Aromaterapi Masajı', category: 'Masaj', duration: '60 dk', price: 850, description: 'Aromaterapi ile masaj' },
  ];

  for (const service of servicesData) {
    await prisma.service.create({
      data: service,
    });
  }
  console.log(`✅ ${servicesData.length} hizmet eklendi`);

  // Demo ürünler ekle
  const productsData = [
    { name: 'L\'Oreal Saç Boyası', category: 'Saç Bakım', stock: 25, minStock: 10, unit: 'Adet', price: 150, supplier: 'L\'Oreal' },
    { name: 'Keratin Seti', category: 'Saç Bakım', stock: 8, minStock: 5, unit: 'Set', price: 450, supplier: 'Brazilian Keratin' },
    { name: 'OPI Oje', category: 'Tırnak', stock: 45, minStock: 20, unit: 'Adet', price: 85, supplier: 'OPI' },
    { name: 'Cilt Bakım Maskesi', category: 'Cilt Bakım', stock: 15, minStock: 10, unit: 'Adet', price: 200, supplier: 'Dermalogica' },
    { name: 'Masaj Yağı', category: 'Masaj', stock: 12, minStock: 8, unit: 'Litre', price: 120, supplier: 'Aromatherapy Associates' },
  ];

  for (const product of productsData) {
    await prisma.product.create({
      data: product,
    });
  }
  console.log(`✅ ${productsData.length} ürün eklendi`);

  // Kampanya ekle
  const campaignData = {
    title: 'Bahar Kampanyası',
    description: 'Tüm cilt bakımlarında %20 indirim',
    discount: 20,
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    status: 'upcoming',
    services: JSON.stringify([]),
  };

  await prisma.campaign.create({
    data: campaignData,
  });
  console.log('✅ Kampanya eklendi');

  // Galeri öğeleri ekle
  const galleryData = [
    { title: 'Balyaj Uygulaması', category: 'Saç', imageUrl: '' },
    { title: 'Gelin Makyajı', category: 'Makyaj', imageUrl: '' },
    { title: 'Protez Tırnak', category: 'Tırnak', imageUrl: '' },
    { title: 'Cilt Bakımı Öncesi/Sonrası', category: 'Cilt', imageUrl: '' },
    { title: 'Saç Boyama', category: 'Saç', imageUrl: '' },
    { title: 'Tırnak Sanatı', category: 'Tırnak', imageUrl: '' },
  ];

  for (const item of galleryData) {
    await prisma.galleryItem.create({
      data: item,
    });
  }
  console.log(`✅ ${galleryData.length} galeri öğesi eklendi`);

  console.log('🎉 Seed işlemi tamamlandı!');
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
