export interface InventoryOwn {
  terceraArpillas: number;
  cuartaArpillas: number;
}

export interface InventoryPurchased {
  terceraArpillas: number;
  cuartaArpillas: number;
}

export interface InventoryState {
  own: InventoryOwn;
  purchased: InventoryPurchased;
  weightPerBag: number;
}

export interface InventorySummary {
  totalArpillasTercera: number;
  totalArpillasCuarta: number;
  totalArpillas: number;
  totalKg: number;
  totalToneladas: number;
  kgTercera: number;
  kgCuarta: number;
}
