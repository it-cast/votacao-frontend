export interface HeaderButton {
  label: string;
  icon?: string;
  link?: string | any[];
  action?: () => void; // Para botões que executam uma função em vez de navegar
  styleClass?: string; // Para estilização customizada (ex: 'p-button-danger')
}