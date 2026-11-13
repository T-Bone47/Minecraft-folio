import React from "react";

interface VoxelIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

/**
 * ORIGINAL PIXEL-ART ENGINEERING ICONS
 * Scalable SVGs rendered with shapeRendering="crispEdges"
 */

export const VoxelRaceCarIcon: React.FC<VoxelIconProps> = ({ size = 20, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} {...props}>
    {/* Chassis */}
    <rect x="2" y="7" width="12" height="3" fill="#D71D35" />
    <rect x="4" y="5" width="6" height="2" fill="#E8EBED" />
    <rect x="6" y="4" width="3" height="1" fill="#191B20" />
    {/* Front & Rear Wings */}
    <rect x="0" y="8" width="2" height="2" fill="#C8CDD2" />
    <rect x="14" y="6" width="2" height="4" fill="#C8CDD2" />
    {/* Wheels */}
    <rect x="3" y="10" width="3" height="2" fill="#101115" />
    <rect x="11" y="10" width="3" height="2" fill="#101115" />
    <rect x="4" y="11" width="1" height="1" fill="#414750" />
    <rect x="12" y="11" width="1" height="1" fill="#414750" />
  </svg>
);

export const VoxelTyreIcon: React.FC<VoxelIconProps> = ({ size = 20, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} {...props}>
    <rect x="3" y="1" width="10" height="14" fill="#101115" />
    <rect x="1" y="3" width="14" height="10" fill="#101115" />
    <rect x="2" y="2" width="12" height="12" fill="#191B20" />
    {/* Rim */}
    <rect x="4" y="4" width="8" height="8" fill="#414750" />
    <rect x="6" y="6" width="4" height="4" fill="#E8EBED" />
    {/* Compound Stripe */}
    <rect x="7" y="2" width="2" height="1" fill="#D71D35" />
    <rect x="7" y="13" width="2" height="1" fill="#D71D35" />
  </svg>
);

export const VoxelTelemetryTowerIcon: React.FC<VoxelIconProps> = ({ size = 20, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} {...props}>
    {/* Mast */}
    <rect x="7" y="4" width="2" height="11" fill="#414750" />
    <rect x="4" y="13" width="8" height="2" fill="#262A31" />
    {/* Crossbeams */}
    <rect x="5" y="7" width="6" height="1" fill="#C8CDD2" />
    <rect x="4" y="10" width="8" height="1" fill="#C8CDD2" />
    {/* Beacon Signal */}
    <rect x="7" y="2" width="2" height="2" fill="#22D3EE" />
    <rect x="6" y="0" width="4" height="1" fill="#22D3EE" opacity="0.6" />
    <rect x="3" y="1" width="1" height="3" fill="#22D3EE" opacity="0.4" />
    <rect x="12" y="1" width="1" height="3" fill="#22D3EE" opacity="0.4" />
  </svg>
);

export const VoxelAiChipIcon: React.FC<VoxelIconProps> = ({ size = 20, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} {...props}>
    {/* Package */}
    <rect x="3" y="3" width="10" height="10" fill="#191B20" />
    <rect x="5" y="5" width="6" height="6" fill="#262A31" />
    <rect x="6" y="6" width="4" height="4" fill="#EABF52" />
    {/* Pins */}
    <rect x="1" y="5" width="2" height="1" fill="#C8CDD2" />
    <rect x="1" y="7" width="2" height="1" fill="#C8CDD2" />
    <rect x="1" y="9" width="2" height="1" fill="#C8CDD2" />
    <rect x="13" y="5" width="2" height="1" fill="#C8CDD2" />
    <rect x="13" y="7" width="2" height="1" fill="#C8CDD2" />
    <rect x="13" y="9" width="2" height="1" fill="#C8CDD2" />
    <rect x="5" y="1" width="1" height="2" fill="#C8CDD2" />
    <rect x="7" y="1" width="1" height="2" fill="#C8CDD2" />
    <rect x="9" y="1" width="1" height="2" fill="#C8CDD2" />
    <rect x="5" y="13" width="1" height="2" fill="#C8CDD2" />
    <rect x="7" y="13" width="1" height="2" fill="#C8CDD2" />
    <rect x="9" y="13" width="1" height="2" fill="#C8CDD2" />
  </svg>
);

export const VoxelDatabaseIcon: React.FC<VoxelIconProps> = ({ size = 20, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} {...props}>
    {/* Top Cylinder */}
    <rect x="2" y="2" width="12" height="3" fill="#414750" />
    <rect x="3" y="1" width="10" height="1" fill="#C8CDD2" />
    <rect x="11" y="3" width="2" height="1" fill="#34D399" />
    {/* Mid Cylinder */}
    <rect x="2" y="6" width="12" height="3" fill="#262A31" />
    <rect x="3" y="5" width="10" height="1" fill="#414750" />
    <rect x="11" y="7" width="2" height="1" fill="#34D399" />
    {/* Bottom Cylinder */}
    <rect x="2" y="10" width="12" height="4" fill="#191B20" />
    <rect x="3" y="9" width="10" height="1" fill="#262A31" />
    <rect x="11" y="11" width="2" height="1" fill="#34D399" />
  </svg>
);

export const VoxelShieldIcon: React.FC<VoxelIconProps> = ({ size = 20, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} {...props}>
    <rect x="2" y="1" width="12" height="2" fill="#C8CDD2" />
    <rect x="2" y="3" width="12" height="6" fill="#D71D35" />
    <rect x="3" y="9" width="10" height="2" fill="#D71D35" />
    <rect x="4" y="11" width="8" height="2" fill="#D71D35" />
    <rect x="6" y="13" width="4" height="2" fill="#D71D35" />
    <rect x="7" y="15" width="2" height="1" fill="#D71D35" />
    {/* Emblem Cross */}
    <rect x="7" y="3" width="2" height="9" fill="#E8EBED" />
    <rect x="4" y="5" width="8" height="2" fill="#E8EBED" />
  </svg>
);

export const VoxelPortalIcon: React.FC<VoxelIconProps> = ({ size = 20, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} {...props}>
    {/* Obsidian Frame */}
    <rect x="2" y="1" width="12" height="2" fill="#262A31" />
    <rect x="2" y="13" width="12" height="2" fill="#262A31" />
    <rect x="2" y="3" width="2" height="10" fill="#262A31" />
    <rect x="12" y="3" width="2" height="10" fill="#262A31" />
    {/* Dimensional Energy */}
    <rect x="4" y="3" width="8" height="10" fill="#8B5CF6" />
    <rect x="5" y="4" width="6" height="8" fill="#A78BFA" />
    <rect x="6" y="6" width="4" height="4" fill="#C4B5FD" />
  </svg>
);

export const VoxelWrenchIcon: React.FC<VoxelIconProps> = ({ size = 20, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} {...props}>
    <rect x="10" y="1" width="4" height="2" fill="#C8CDD2" />
    <rect x="13" y="3" width="2" height="4" fill="#C8CDD2" />
    <rect x="8" y="3" width="2" height="2" fill="#C8CDD2" />
    <rect x="9" y="5" width="2" height="2" fill="#C8CDD2" />
    <rect x="7" y="7" width="3" height="3" fill="#8E8E93" />
    <rect x="5" y="9" width="3" height="3" fill="#8E8E93" />
    <rect x="3" y="11" width="3" height="3" fill="#8E8E93" />
    <rect x="1" y="13" width="3" height="3" fill="#414750" />
  </svg>
);

export const VoxelMissionFlagIcon: React.FC<VoxelIconProps> = ({ size = 20, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} {...props}>
    {/* Flagpole */}
    <rect x="2" y="1" width="2" height="14" fill="#C8CDD2" />
    <rect x="1" y="14" width="4" height="2" fill="#414750" />
    {/* Flag Pennant */}
    <rect x="4" y="2" width="10" height="6" fill="#FFAA00" />
    <rect x="6" y="2" width="2" height="3" fill="#101115" />
    <rect x="10" y="2" width="2" height="3" fill="#101115" />
    <rect x="4" y="5" width="2" height="3" fill="#101115" />
    <rect x="8" y="5" width="2" height="3" fill="#101115" />
    <rect x="12" y="5" width="2" height="3" fill="#101115" />
  </svg>
);

export const VoxelVerifiedCheckIcon: React.FC<VoxelIconProps> = ({ size = 20, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" className={className} {...props}>
    <rect x="1" y="1" width="14" height="14" fill="#121418" />
    <rect x="2" y="2" width="12" height="12" fill="#15803D" />
    {/* Checkmark Pixels */}
    <rect x="4" y="8" width="2" height="2" fill="#FFFFFF" />
    <rect x="6" y="10" width="2" height="2" fill="#FFFFFF" />
    <rect x="8" y="8" width="2" height="2" fill="#FFFFFF" />
    <rect x="10" y="6" width="2" height="2" fill="#FFFFFF" />
    <rect x="12" y="4" width="2" height="2" fill="#FFFFFF" />
  </svg>
);
