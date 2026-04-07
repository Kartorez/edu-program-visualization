export const getElectiveGroup = (code: string) => {
  if (!code?.startsWith('ВК')) return null;
  return code.split('.')[0].trim();
};
