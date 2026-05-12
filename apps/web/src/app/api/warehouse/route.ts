import { NextResponse } from 'next/server';
import { TRIAL_WAREHOUSE } from '@/lib/warehouse-catalog';

// Global simulation state (In-memory for trial mode)
let currentWarehouse = [...TRIAL_WAREHOUSE];
let simulationTime = new Date().toISOString();
let warehouseAlerts: any[] = [];

export async function GET() {
  return NextResponse.json({ 
    catalog: currentWarehouse,
    simulationTime,
    alerts: warehouseAlerts 
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action, id, status, time, alert } = body;

  if (action === 'TOGGLE_STOCK') {
    currentWarehouse = currentWarehouse.map(p => 
      p.id === id ? { ...p, in_stock: status } : p
    );
  }

  if (action === 'SET_TIME') {
    simulationTime = time;
  }

  if (action === 'LOG_ALERT') {
    warehouseAlerts = [alert, ...warehouseAlerts].slice(0, 50); // Keep last 50
  }

  return NextResponse.json({ success: true, catalog: currentWarehouse, simulationTime, alerts: warehouseAlerts });
}

// Helper for the Engine to get latest trial data
export function getTrialWarehouse() {
  return currentWarehouse;
}

export function getSimulationTime() {
  return new Date(simulationTime);
}
