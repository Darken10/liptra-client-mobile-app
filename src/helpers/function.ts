export function formatNombre(nombre: number): string {
    return nombre.toLocaleString('fr-FR'); // Utilise les conventions françaises
}

export function formatMontant(nombre: number, devise: string = 'XOF'): string {
    return `${formatNombre(nombre)} ${devise}`;
}