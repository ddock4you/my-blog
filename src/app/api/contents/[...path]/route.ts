import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathArray } = await params;
    const filePath = pathArray.join('/');
    const fullPath = path.join(process.cwd(), 'src', 'contents', filePath);

    // 보안을 위해 경로 검증
    if (!fullPath.startsWith(path.join(process.cwd(), 'src', 'contents'))) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // 파일이 존재하는지 확인
    if (!fs.existsSync(fullPath)) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // 파일 읽기
    const fileBuffer = fs.readFileSync(fullPath);

    // 파일 확장자에 따른 MIME 타입 설정
    const ext = path.extname(fullPath).toLowerCase();
    let contentType = 'application/octet-stream';

    switch (ext) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
    }

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
