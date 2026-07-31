import { NextResponse } from 'next/server';
import { commentRepository } from '@/lib/repositories/commentRepository';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await commentRepository.delete(id);
  return NextResponse.json({ success: true });
}
