import { jsPDF } from 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: {
      startY?: number;
      head?: any[][];
      body?: any[][];
      theme?: string;
      headStyles?: any;
      columnStyles?: any;
      margin?: any;
      styles?: any;
    }) => void;
    lastAutoTable: {
      finalY: number;
    };
  }
}