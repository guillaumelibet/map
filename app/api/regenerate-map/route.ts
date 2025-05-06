import { exec } from 'child_process';
import { NextResponse } from 'next/server';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    const { stdout, stderr } = await execAsync('node scripts/generate-static-map.js');
    
    if (stderr) {
      console.error('Erreur lors de la régénération:', stderr);
      return NextResponse.json({ error: stderr }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Carte régénérée avec succès',
      output: stdout 
    });
  } catch (error) {
    console.error('Erreur lors de la régénération:', error);
    return NextResponse.json({ error: 'Erreur lors de la régénération' }, { status: 500 });
  }
} 