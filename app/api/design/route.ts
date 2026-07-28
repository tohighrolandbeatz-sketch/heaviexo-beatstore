import { NextRequest, NextResponse } from "next/server";
import { getDesign, saveDesign, resetDesign, applyPreset } from "../../../lib/designService";

export async function GET() {
  try {
    return NextResponse.json(getDesign());
  } catch (err) {
    return NextResponse.json({ error: "Erreur lecture design" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.action === "reset") {
      const reset = resetDesign();
      return NextResponse.json({ success: true, design: reset });
    }
    if (body.action === "preset" && body.presetName) {
      const updated = applyPreset(body.presetName);
      return NextResponse.json({ success: true, design: updated });
    }
    saveDesign(body);
    return NextResponse.json({ success: true, design: body });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Erreur lors de la sauvegarde" }, { status: 500 });
  }
}