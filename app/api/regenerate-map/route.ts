import { exec } from 'child_process';
import { NextResponse } from 'next/server';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    // Générer les deux cartes
    const [normalMap, denseMap] = await Promise.all([
      execAsync('node scripts/generate-static-map.js'),
      execAsync('node scripts/generate-dense-map.js')
    ]);
    
    if (normalMap.stderr || denseMap.stderr) {
      console.error('Erreur lors de la régénération:', normalMap.stderr || denseMap.stderr);
      return NextResponse.json({ error: normalMap.stderr || denseMap.stderr }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Cartes régénérées avec succès',
      output: {
        normal: normalMap.stdout,
        dense: denseMap.stdout
      }
    });
  } catch (error) {
    console.error('Erreur lors de la régénération:', error);
    return NextResponse.json({ error: 'Erreur lors de la régénération' }, { status: 500 });
  }
} 