export interface FarmConfig {
  id: number;
  name: string;
  width: number;
  minHeight: number;
  maxHeight: number;
  length: number;
  radio: number;
  rowCount: number;
  columnCount: number;
}

export interface PlantProps {
  id: number;
  name: string;
  farmId: number;
  seedId: number;
  seedSlot: number;
  growStatus: number;
  positionX: number;
  positionY: number;
  positionZ: number;
  soilPositionX: number;
  soilPositionY: number;
  type: string;
}
