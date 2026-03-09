import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 400 }
      );
    }

    // Dosya tipini kontrol et
    const fileType = file.type;
    const isImage = fileType.startsWith('image/');
    const isVideo = fileType.startsWith('video/');

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'Sadece resim ve video dosyaları yüklenebilir' },
        { status: 400 }
      );
    }

    // Dosya boyutu kontrolü (50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Dosya boyutu maksimum 50MB olabilir' },
        { status: 400 }
      );
    }

    // Dosya uzantısını al
    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    
    // Benzersiz dosya adı oluştur
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`;
    
    // Klasör yolu belirle
    const folder = isImage ? 'images' : 'videos';
    const publicPath = join(process.cwd(), 'public', folder);
    
    // Klasör yoksa oluştur
    if (!existsSync(publicPath)) {
      await mkdir(publicPath, { recursive: true });
    }

    // Dosyayı kaydet
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(publicPath, uniqueName);
    await writeFile(filePath, buffer);

    // URL'i döndür
    const fileUrl = `/${folder}/${uniqueName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      type: isImage ? 'image' : 'video',
      fileName: uniqueName,
    }, { status: 201 });

  } catch (error) {
    console.error('Dosya yükleme hatası:', error);
    return NextResponse.json(
      { error: 'Dosya yüklenemedi' },
      { status: 500 }
    );
  }
}
