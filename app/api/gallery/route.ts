import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const LEGACY_GALLERY_ITEMS = [
  { title: 'Legacy Image 1', category: 'image', imageUrl: '/images/585423595_122108156013083638_4684200036309214416_n..jpg' },
  { title: 'Legacy Video 1', category: 'video', imageUrl: '/videos/AQMN5f4-Mi1kZ9-828w4nmsfVa5ptaE2TsfdmOkdlnZPNGRedbK31G5hUKTxh3yeVQYNczAR592tpGoCRSJtynfF9dtG5OlLR-1TsHk.mp4' },
  { title: 'Legacy Image 2', category: 'image', imageUrl: '/images/589167628_122109067953083638_1588938081792428857_n..jpg' },
  { title: 'Legacy Video 2', category: 'video', imageUrl: '/videos/AQNM2vLRAvzqE2mKGItz3qs8hFzhYPjr2KyBbw4Asngycvi2xK5yeMJtEFGOMG3_-KUUQUlt8LJC5uCGoOjayIOLuMY8Np1c.mp4' },
  { title: 'Legacy Image 3', category: 'image', imageUrl: '/images/594100529_122110689213083638_7179114761612870739_n..jpg' },
  { title: 'Legacy Video 3', category: 'video', imageUrl: '/videos/AQNp-4_w7hmIbfBNYvkN8BkK2NIlwMInCIF-TiKENhy8aWL3YWE1M-LqsnVDkKSF-GabL6_R9sbJqSa9cQ0nBB6wKS70rOTs0seW2lY.mp4' },
  { title: 'Legacy Image 4', category: 'image', imageUrl: '/images/596063079_122111095983083638_3381646773219951484_n..jpg' },
  { title: 'Legacy Video 4', category: 'video', imageUrl: '/videos/AQOQg9-6E9RaTFctbG85lg3SHNlhKkjb5PuS_iz71yZsj8EaAmxyAZUki5Z-ely5enckfiHrSVR7W0zZBj43VpyU_6Edrsx_.mp4' },
  { title: 'Legacy Image 5', category: 'image', imageUrl: '/images/597551827_122111562711083638_8445761000020730382_n..jpg' },
  { title: 'Legacy Video 5', category: 'video', imageUrl: '/videos/AQOlzQjaPABDMfNmUuq21hsxUKj-fkVFCfz6M89jV0bG9kI9OYhmqfpvysqOYlr3v4ZCfRqpUE70iAws8TJMmM_Ag9NeDmat.mp4' },
  { title: 'Legacy Image 6', category: 'image', imageUrl: '/images/597552177_122111862837083638_6008478305036244426_n..jpg' },
  { title: 'Legacy Video 6', category: 'video', imageUrl: '/videos/AQP9ae5TdJwcaiYBwvxo5S09nAtfNv7c2F6AO8QfRCiXlcessL9MqgpdTNc3g5alp7aQp1G7_KdkZwoa5Sgf_1MwOOYZjfZY.mp4' },
  { title: 'Legacy Image 7', category: 'image', imageUrl: '/images/599941626_122112861981083638_8137216023031339708_n..jpg' },
  { title: 'Legacy Video 7', category: 'video', imageUrl: '/videos/AQPvCm-k-LesSx0qZ3dfPb5ctrx-tW71PpxnT5AdajIIjtVesVnGbNUwpIDYEYxrMaxitjdiZOaG7P_AUkmofGgeogEkDuGB.mp4' },
  { title: 'Legacy Image 8', category: 'image', imageUrl: '/images/600298904_122112477351083638_6274367331590897151_n..jpg' },
  { title: 'Legacy Video 8', category: 'video', imageUrl: '/videos/AQPxaELP6EBfG6eXxBeAaLI_vebduN8gXvxUiIlP3GXOZb9UHOLpRu9R6q_vW6fhTMMiKjB7Z3TZqEl9HZARKPpRBLv6YmH9.mp4' },
  { title: 'Legacy Image 9', category: 'image', imageUrl: '/images/602995360_122113242213083638_5246041994386207911_n..jpg' },
];

type GalleryPayload = {
  title?: string;
  category?: string;
  imageUrl?: string;
  type?: 'image' | 'video';
  url?: string;
};

export async function GET() {
  try {
    let items = await prisma.galleryItem.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Restore old gallery media once if table is empty.
    if (items.length === 0) {
      await prisma.galleryItem.createMany({
        data: LEGACY_GALLERY_ITEMS,
      });

      items = await prisma.galleryItem.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return NextResponse.json(items, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error) {
    console.error('Galeri getirme hatasi:', error);
    return NextResponse.json({ error: 'Galeri getirilemedi' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GalleryPayload;

    const resolvedType = body.type || (body.category === 'video' ? 'video' : 'image');
    const resolvedUrl = (body.url || body.imageUrl || '').trim();
    const resolvedTitle = (body.title || 'Yeni Medya').trim();

    if (!resolvedUrl) {
      return NextResponse.json({ error: 'Medya URL zorunludur' }, { status: 400 });
    }

    if (resolvedType !== 'image' && resolvedType !== 'video') {
      return NextResponse.json({ error: 'Medya tipi image veya video olmalidir' }, { status: 400 });
    }

    const item = await prisma.galleryItem.create({
      data: {
        title: resolvedTitle,
        category: resolvedType,
        imageUrl: resolvedUrl,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Galeri ogesi olusturma hatasi:', error);
    return NextResponse.json({ error: 'Galeri ogesi olusturulamadi' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
    }

    await prisma.galleryItem.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Galeri ogesi silme hatasi:', error);
    return NextResponse.json({ error: 'Galeri ogesi silinemedi' }, { status: 500 });
  }
}
