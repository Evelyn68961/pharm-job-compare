export function hospitalInitials(briefName: string | null, fullName: string): string {
  const source = (briefName?.trim() || fullName.trim()) ?? '';
  if (!source) return '';
  return Array.from(source).slice(0, 2).join('');
}
