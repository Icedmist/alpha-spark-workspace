import React from 'react';
import {
  Code2,
  GraduationCap,
  Palette,
  Megaphone,
  Handshake,
  DollarSign,
  Users,
  Briefcase,
  ShieldCheck,
  FolderKanban,
  LucideIcon,
} from 'lucide-react';

export const getDirectorateIcon = (codeOrIcon?: string): LucideIcon => {
  if (!codeOrIcon) return FolderKanban;
  const key = codeOrIcon.toUpperCase();

  if (key === 'DEV' || key === 'CODE' || key === 'CODE2') return Code2;
  if (key === 'EDU' || key === 'GRADUATIONCAP') return GraduationCap;
  if (key === 'DSG' || key === 'PALETTE') return Palette;
  if (key === 'MKT' || key === 'MEGAPHONE') return Megaphone;
  if (key === 'PRT' || key === 'HANDSHAKE') return Handshake;
  if (key === 'FIN' || key === 'DOLLARSIGN') return DollarSign;
  if (key === 'HR' || key === 'USERS') return Users;
  if (key === 'OPS' || key === 'BRIEFCASE') return Briefcase;
  if (key === 'EXEC' || key === 'SHIELD' || key === 'SHIELDCHECK') return ShieldCheck;

  return FolderKanban;
};
