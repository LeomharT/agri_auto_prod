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
  no: number;
  id: number;
  name: string;
  seedId: number;
  seedImgUrl: string;
  seedSlot: number;
  farmId: number;
  growStatus: number;
  positionX: number;
  positionY: number;
  positionZ: number;
  soilPositionX: number;
  soilPositionY: number;
  plantStatus: number;
  plantTime: string;
  remark: string;
  type: string;
}
