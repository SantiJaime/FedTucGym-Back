
export default class TorneoService {
  private torneos: Torneo[] = [];

  public obtenerTodos(): Torneo[] {
    return this.torneos;
  }

  public obtenerPorId(id: string): Torneo | undefined {
    return this.torneos.find(torneo => torneo.id === id);
  }

  public crear(torneoData: Torneo): Torneo {
    this.torneos.push(torneoData);
    return torneoData;
  }

  public actualizar(id: string, torneoData: Partial<Torneo>): Torneo | null {
    const torneoIndex = this.torneos.findIndex(t => t.id === id);
    
    if (torneoIndex === -1) {
      return null;
    }

    const torneoActualizado = {
      ...this.torneos[torneoIndex],
      ...torneoData,
      id
    };

    this.torneos[torneoIndex] = torneoActualizado;
    return torneoActualizado;
  }

  public eliminar(id: string): boolean {
    const torneoIndex = this.torneos.findIndex(t => t.id === id);
    if (torneoIndex === -1) {
      return false;
    }
    
    this.torneos.splice(torneoIndex, 1);
    return true;
  }
}