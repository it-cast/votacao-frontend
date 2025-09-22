/**
 * Define a estrutura para configurar uma coluna da tabela.
 */
export interface ColumnDefinition {
  field: string; // Chave do objeto de dados (ex: 'descricao')
  header: string; // Texto do cabeçalho (ex: 'Descrição')
  type?: 'text' | 'badge'; // Tipo de dado para renderização especial
  pipe?: 'phone' | 'cpfCnpj' | 'date'; 
  
  badgeConfig?: { // Configurações específicas se o tipo for 'badge'
    trueValue: string;
    falseValue: string;
    trueSeverity: 'success' | 'danger' | 'info' | 'warning';
    falseSeverity: 'success' | 'danger' | 'info' | 'warning';
  };
}

/**
 * Define os tipos de 'severity' compatíveis com o p-button do PrimeNG.
 */
export type ActionSeverity =  'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'contrast';



/**
 * Define a estrutura para configurar um botão de ação.
 */
export interface ActionDefinition {
  actionId: string; // Um ID único para a ação (ex: 'edit', 'delete')
  icon: string; // Ícone do Font Awesome (ex: 'fa-solid fa-pen')
  tooltip: string; // Dica de ferramenta (ex: 'Editar')
  severity: ActionSeverity; // Cor do botão
}

