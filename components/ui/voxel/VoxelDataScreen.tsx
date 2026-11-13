import React from "react";

interface VoxelDataScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const VoxelDataScreen: React.FC<VoxelDataScreenProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`voxel-data-screen p-4 text-xs font-mono leading-relaxed ${className}`} {...props}>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

