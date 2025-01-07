"use client";

import React from 'react';

import styles from './TableSkeleton.module.scss'

interface TableSkeletonProps {
  nHeaders: number
  nRows: number

}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  nHeaders, 
  nRows 
}) => {
  return (
    <div className={styles.tableSkeletonContainer}>
      <table>
        <thead>
          <tr>
            {Array.from({ length: nHeaders }).map((_, i) => (
              <th key={i}></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: nRows }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: nHeaders }).map((_, j) => (
                <td key={j}></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
