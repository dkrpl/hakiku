import React from 'react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { DoorCodePanel } from './DoorCodePanel';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('DoorCodePanel', () => {
  it('menghitung mundur lalu menutup tab; bila ditolak browser, muncul petunjuk tutup tab', () => {
    vi.useFakeTimers();
    const close = vi.spyOn(window, 'close').mockImplementation(() => {});
    render(<DoorCodePanel roomNumber={2} doorCode="381" isFinal={false} returnSeconds={3} onRestart={() => {}} />);

    expect(screen.getByTestId('door-code')).toHaveAccessibleName('Kode pintu 381');
    act(() => vi.advanceTimersByTime(2000)); // digit selesai berputar
    expect(screen.getByText(/Kembali ke Canva otomatis dalam 3 detik/)).toBeInTheDocument();

    for (let i = 0; i < 4; i += 1) act(() => vi.advanceTimersByTime(1000));
    act(() => vi.advanceTimersByTime(500));
    expect(close).toHaveBeenCalled();
    expect(screen.getByRole('alertdialog', { name: /Tutup tab ini/ })).toBeInTheDocument();
  });

  it('pindah ke link Canva bila guru mengisinya', () => {
    vi.useFakeTimers();
    const assign = vi.fn();
    const original = window.location;
    Object.defineProperty(window, 'location', { configurable: true, value: { ...original, assign } });
    render(
      <DoorCodePanel roomNumber={1} doorCode="274" isFinal={false} returnSeconds={1} returnUrl="https://www.canva.com/x" onRestart={() => {}} />
    );
    act(() => vi.advanceTimersByTime(2000));
    for (let i = 0; i < 3; i += 1) act(() => vi.advanceTimersByTime(1000));
    expect(assign).toHaveBeenCalledWith('https://www.canva.com/x');
    Object.defineProperty(window, 'location', { configurable: true, value: original });
  });
});
