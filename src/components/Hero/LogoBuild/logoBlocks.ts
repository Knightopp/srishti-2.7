export interface LogoBlock {
  id: string;
  name: string;
  category: 'foundation' | 'outer_frame' | 'hook' | 'top_stems' | 'accents';
  x: number;
  y: number;
  w: number;
  h: number;
  depth: number;
  scrollStart: number;
  scrollEnd: number;
  startDx: number;
  startDy: number;
  startDz: number;
  startRotateX: number;
  startRotateY: number;
  startRotateZ: number;
  initialOpacity: number;
  primaryColor: string;
  secondaryColor: string;
}

export const LOGO_BLOCKS: LogoBlock[] = [
  // ==========================================
  // PHASE 1: FOUNDATION & BOTTOM-LEFT BOX (0.00 -> 0.20)
  // Visible at start as subtle floating base blocks
  // ==========================================
  {
    id: 'bl_box_base',
    name: 'Bottom Left Box Base',
    category: 'foundation',
    x: 70, y: 400, w: 125, h: 35,
    depth: 16,
    scrollStart: 0.00, scrollEnd: 0.14,
    startDx: -70, startDy: 40, startDz: -50,
    startRotateX: 20, startRotateY: -15, startRotateZ: 10,
    initialOpacity: 0.50,
    primaryColor: '#087FF0', secondaryColor: '#1238F5'
  },
  {
    id: 'bl_box_left',
    name: 'Bottom Left Box Left Wall',
    category: 'foundation',
    x: 70, y: 310, w: 35, h: 90,
    depth: 16,
    scrollStart: 0.02, scrollEnd: 0.16,
    startDx: -80, startDy: 30, startDz: -40,
    startRotateX: -15, startRotateY: 20, startRotateZ: -10,
    initialOpacity: 0.40,
    primaryColor: '#087FF0', secondaryColor: '#1238F5'
  },
  {
    id: 'bl_box_top',
    name: 'Bottom Left Box Top Wall',
    category: 'foundation',
    x: 105, y: 310, w: 90, h: 35,
    depth: 16,
    scrollStart: 0.05, scrollEnd: 0.18,
    startDx: -50, startDy: 20, startDz: -50,
    startRotateX: 20, startRotateY: 10, startRotateZ: -15,
    initialOpacity: 0.30,
    primaryColor: '#087FF0', secondaryColor: '#1238F5'
  },
  {
    id: 'bl_box_right',
    name: 'Bottom Left Box Inner Right',
    category: 'foundation',
    x: 160, y: 345, w: 35, h: 55,
    depth: 16,
    scrollStart: 0.08, scrollEnd: 0.20,
    startDx: -30, startDy: 25, startDz: -30,
    startRotateX: -10, startRotateY: -15, startRotateZ: 10,
    initialOpacity: 0.25,
    primaryColor: '#087FF0', secondaryColor: '#1238F5'
  },
  {
    id: 'bl_center_square',
    name: 'Bottom Left Inner Square Dot Block',
    category: 'foundation',
    x: 110, y: 360, w: 22, h: 22,
    depth: 12,
    scrollStart: 0.07, scrollEnd: 0.19,
    startDx: -45, startDy: 20, startDz: -20,
    startRotateX: 15, startRotateY: -10, startRotateZ: 10,
    initialOpacity: 0.35,
    primaryColor: '#087FF0', secondaryColor: '#1238F5'
  },
  {
    id: 'bot_bar_1',
    name: 'Bottom Bar Left Joint',
    category: 'foundation',
    x: 195, y: 400, w: 55, h: 35,
    depth: 14,
    scrollStart: 0.11, scrollEnd: 0.22,
    startDx: -40, startDy: 35, startDz: -20,
    startRotateX: 10, startRotateY: 10, startRotateZ: -10,
    initialOpacity: 0.20,
    primaryColor: '#087FF0', secondaryColor: '#1238F5'
  },
  {
    id: 'bot_bar_2',
    name: 'Bottom Bar Center',
    category: 'foundation',
    x: 250, y: 400, w: 55, h: 35,
    depth: 14,
    scrollStart: 0.14, scrollEnd: 0.25,
    startDx: 0, startDy: 45, startDz: -40,
    startRotateX: 20, startRotateY: 0, startRotateZ: 0,
    initialOpacity: 0.15,
    primaryColor: '#087FF0', secondaryColor: '#1238F5'
  },
  {
    id: 'bot_bar_3',
    name: 'Bottom Bar Right Joint',
    category: 'foundation',
    x: 305, y: 400, w: 55, h: 35,
    depth: 14,
    scrollStart: 0.17, scrollEnd: 0.28,
    startDx: 40, startDy: 40, startDz: -30,
    startRotateX: -15, startRotateY: -10, startRotateZ: 10,
    initialOpacity: 0.05,
    primaryColor: '#087FF0', secondaryColor: '#1238F5'
  },

  // ==========================================
  // PHASE 2: OUTER FRAME & RIGHT COLUMN (0.20 -> 0.45)
  // ==========================================
  {
    id: 'right_col_base',
    name: 'Right Column Base',
    category: 'outer_frame',
    x: 360, y: 345, w: 55, h: 90,
    depth: 16,
    scrollStart: 0.20, scrollEnd: 0.32,
    startDx: 70, startDy: 35, startDz: -40,
    startRotateX: -10, startRotateY: 20, startRotateZ: -10,
    initialOpacity: 0.0,
    primaryColor: '#087FF0', secondaryColor: '#1238F5'
  },
  {
    id: 'right_col_mid_low',
    name: 'Right Column Mid-Lower',
    category: 'outer_frame',
    x: 360, y: 260, w: 55, h: 85,
    depth: 16,
    scrollStart: 0.23, scrollEnd: 0.35,
    startDx: 80, startDy: 20, startDz: -30,
    startRotateX: 15, startRotateY: -15, startRotateZ: 10,
    initialOpacity: 0.0,
    primaryColor: '#00E5FF', secondaryColor: '#087FF0'
  },
  {
    id: 'right_col_mid_high',
    name: 'Right Column Mid-Upper',
    category: 'outer_frame',
    x: 360, y: 175, w: 55, h: 85,
    depth: 16,
    scrollStart: 0.26, scrollEnd: 0.38,
    startDx: 75, startDy: 10, startDz: -20,
    startRotateX: -15, startRotateY: 10, startRotateZ: -10,
    initialOpacity: 0.0,
    primaryColor: '#00E5FF', secondaryColor: '#087FF0'
  },
  {
    id: 'right_col_top',
    name: 'Right Column Top Spine',
    category: 'outer_frame',
    x: 360, y: 90, w: 55, h: 85,
    depth: 16,
    scrollStart: 0.29, scrollEnd: 0.41,
    startDx: 65, startDy: 15, startDz: -30,
    startRotateX: 20, startRotateY: -10, startRotateZ: 15,
    initialOpacity: 0.0,
    primaryColor: '#00E5FF', secondaryColor: '#087FF0'
  },
  {
    id: 'right_col_corner',
    name: 'Right Column Top Corner',
    category: 'outer_frame',
    x: 360, y: 40, w: 55, h: 50,
    depth: 16,
    scrollStart: 0.32, scrollEnd: 0.44,
    startDx: 50, startDy: 15, startDz: -40,
    startRotateX: -20, startRotateY: 15, startRotateZ: -10,
    initialOpacity: 0.0,
    primaryColor: '#00E5FF', secondaryColor: '#087FF0'
  },

  // ==========================================
  // PHASE 3: MIDDLE-RIGHT U-HOOK & INNER STEM (0.40 -> 0.65)
  // ==========================================
  {
    id: 'mr_stem_top',
    name: 'Middle Right Stem Top',
    category: 'hook',
    x: 300, y: 40, w: 45, h: 80,
    depth: 14,
    scrollStart: 0.38, scrollEnd: 0.49,
    startDx: 40, startDy: 15, startDz: 30,
    startRotateX: 10, startRotateY: -15, startRotateZ: 10,
    initialOpacity: 0.0,
    primaryColor: '#00E5FF', secondaryColor: '#087FF0'
  },
  {
    id: 'mr_stem_mid1',
    name: 'Middle Right Stem Mid 1',
    category: 'hook',
    x: 300, y: 120, w: 45, h: 80,
    depth: 14,
    scrollStart: 0.41, scrollEnd: 0.52,
    startDx: 50, startDy: 20, startDz: 30,
    startRotateX: -10, startRotateY: 10, startRotateZ: -10,
    initialOpacity: 0.0,
    primaryColor: '#00E5FF', secondaryColor: '#087FF0'
  },
  {
    id: 'mr_stem_mid2',
    name: 'Middle Right Stem Mid 2',
    category: 'hook',
    x: 300, y: 200, w: 45, h: 80,
    depth: 14,
    scrollStart: 0.44, scrollEnd: 0.55,
    startDx: 45, startDy: 25, startDz: 20,
    startRotateX: 15, startRotateY: -10, startRotateZ: 10,
    initialOpacity: 0.0,
    primaryColor: '#087FF0', secondaryColor: '#1238F5'
  },
  {
    id: 'mr_stem_bot',
    name: 'Middle Right Stem Lower Drop',
    category: 'hook',
    x: 300, y: 280, w: 45, h: 50,
    depth: 14,
    scrollStart: 0.47, scrollEnd: 0.58,
    startDx: 35, startDy: 30, startDz: 15,
    startRotateX: -10, startRotateY: 10, startRotateZ: -5,
    initialOpacity: 0.0,
    primaryColor: '#087FF0', secondaryColor: '#1238F5'
  },
  {
    id: 'mr_hook_turn',
    name: 'U-Hook Bottom Connector',
    category: 'hook',
    x: 240, y: 325, w: 105, h: 45,
    depth: 14,
    scrollStart: 0.50, scrollEnd: 0.61,
    startDx: 10, startDy: 40, startDz: 30,
    startRotateX: 20, startRotateY: 0, startRotateZ: -10,
    initialOpacity: 0.0,
    primaryColor: '#087FF0', secondaryColor: '#1238F5'
  },
  {
    id: 'mr_inner_low',
    name: 'Inner Rising Stem Base',
    category: 'hook',
    x: 240, y: 255, w: 45, h: 70,
    depth: 14,
    scrollStart: 0.53, scrollEnd: 0.64,
    startDx: -20, startDy: 35, startDz: 30,
    startRotateX: -15, startRotateY: -10, startRotateZ: 10,
    initialOpacity: 0.0,
    primaryColor: '#087FF0', secondaryColor: '#1238F5'
  },
  {
    id: 'mr_inner_mid',
    name: 'Inner Rising Stem Mid',
    category: 'hook',
    x: 240, y: 185, w: 45, h: 70,
    depth: 14,
    scrollStart: 0.56, scrollEnd: 0.67,
    startDx: -15, startDy: 20, startDz: 20,
    startRotateX: 10, startRotateY: 10, startRotateZ: -10,
    initialOpacity: 0.0,
    primaryColor: '#00E5FF', secondaryColor: '#087FF0'
  },
  {
    id: 'mr_inner_top',
    name: 'Inner Rising Stem Peak',
    category: 'hook',
    x: 240, y: 130, w: 45, h: 55,
    depth: 14,
    scrollStart: 0.59, scrollEnd: 0.70,
    startDx: -10, startDy: 15, startDz: 25,
    startRotateX: -10, startRotateY: -10, startRotateZ: 5,
    initialOpacity: 0.0,
    primaryColor: '#00E5FF', secondaryColor: '#087FF0'
  },

  // ==========================================
  // PHASE 4: TOP BAR & 3 VERTICAL STEMS (0.60 -> 0.80)
  // ==========================================
  {
    id: 'top_bar_left',
    name: 'Top Header Bar Left',
    category: 'top_stems',
    x: 95, y: 40, w: 65, h: 45,
    depth: 16,
    scrollStart: 0.60, scrollEnd: 0.71,
    startDx: -60, startDy: 15, startDz: -30,
    startRotateX: 20, startRotateY: -10, startRotateZ: 10,
    initialOpacity: 0.0,
    primaryColor: '#00E5FF', secondaryColor: '#087FF0'
  },
  {
    id: 'top_bar_center',
    name: 'Top Header Bar Center',
    category: 'top_stems',
    x: 160, y: 40, w: 65, h: 45,
    depth: 16,
    scrollStart: 0.63, scrollEnd: 0.74,
    startDx: -30, startDy: 15, startDz: -40,
    startRotateX: -15, startRotateY: 15, startRotateZ: -10,
    initialOpacity: 0.0,
    primaryColor: '#00E5FF', secondaryColor: '#087FF0'
  },
  {
    id: 'top_bar_right',
    name: 'Top Header Bar Right',
    category: 'top_stems',
    x: 225, y: 40, w: 65, h: 45,
    depth: 16,
    scrollStart: 0.66, scrollEnd: 0.77,
    startDx: 15, startDy: 15, startDz: -30,
    startRotateX: 10, startRotateY: -10, startRotateZ: 10,
    initialOpacity: 0.0,
    primaryColor: '#00E5FF', secondaryColor: '#087FF0'
  },
  {
    id: 'stem_l_top',
    name: 'Left Stem Upper Segment',
    category: 'top_stems',
    x: 95, y: 85, w: 45, h: 70,
    depth: 14,
    scrollStart: 0.68, scrollEnd: 0.79,
    startDx: -70, startDy: 20, startDz: -20,
    startRotateX: -10, startRotateY: 15, startRotateZ: -10,
    initialOpacity: 0.0,
    primaryColor: '#00E5FF', secondaryColor: '#087FF0'
  },
  {
    id: 'stem_l_mid',
    name: 'Left Stem Mid Segment',
    category: 'top_stems',
    x: 95, y: 155, w: 45, h: 70,
    depth: 14,
    scrollStart: 0.70, scrollEnd: 0.81,
    startDx: -65, startDy: 25, startDz: -15,
    startRotateX: 15, startRotateY: -10, startRotateZ: 10,
    initialOpacity: 0.0,
    primaryColor: '#00E5FF', secondaryColor: '#087FF0'
  },
  {
    id: 'stem_l_bot',
    name: 'Left Stem Lower Base',
    category: 'top_stems',
    x: 95, y: 225, w: 45, h: 65,
    depth: 14,
    scrollStart: 0.72, scrollEnd: 0.83,
    startDx: -60, startDy: 30, startDz: -10,
    startRotateX: -10, startRotateY: 10, startRotateZ: -5,
    initialOpacity: 0.0,
    primaryColor: '#087FF0', secondaryColor: '#1238F5'
  },
  {
    id: 'stem_m_top',
    name: 'Middle Stem Upper Segment',
    category: 'top_stems',
    x: 165, y: 85, w: 45, h: 70,
    depth: 14,
    scrollStart: 0.69, scrollEnd: 0.80,
    startDx: -40, startDy: 20, startDz: 20,
    startRotateX: 10, startRotateY: -15, startRotateZ: 10,
    initialOpacity: 0.0,
    primaryColor: '#00E5FF', secondaryColor: '#087FF0'
  },
  {
    id: 'stem_m_mid',
    name: 'Middle Stem Mid Segment',
    category: 'top_stems',
    x: 165, y: 155, w: 45, h: 70,
    depth: 14,
    scrollStart: 0.71, scrollEnd: 0.82,
    startDx: -35, startDy: 25, startDz: 20,
    startRotateX: -10, startRotateY: 10, startRotateZ: -10,
    initialOpacity: 0.0,
    primaryColor: '#00E5FF', secondaryColor: '#087FF0'
  },
  {
    id: 'stem_m_bot',
    name: 'Middle Stem Lower Base',
    category: 'top_stems',
    x: 165, y: 225, w: 45, h: 65,
    depth: 14,
    scrollStart: 0.73, scrollEnd: 0.84,
    startDx: -30, startDy: 30, startDz: 15,
    startRotateX: 10, startRotateY: -10, startRotateZ: 5,
    initialOpacity: 0.0,
    primaryColor: '#087FF0', secondaryColor: '#1238F5'
  },

  // ==========================================
  // PHASE 5: ACCENTS & FINE DETAILS (0.75 -> 0.88)
  // Fully assembled at 0.88 and held solid through 1.00!
  // ==========================================
  {
    id: 'acc_tl_line',
    name: 'Top Left Accent Vertical Line',
    category: 'accents',
    x: 74, y: 105, w: 6, h: 115,
    depth: 8,
    scrollStart: 0.75, scrollEnd: 0.85,
    startDx: -50, startDy: 20, startDz: 30,
    startRotateX: -15, startRotateY: 15, startRotateZ: -15,
    initialOpacity: 0.0,
    primaryColor: '#00E5FF', secondaryColor: '#00E5FF'
  },
  {
    id: 'acc_ml_dot',
    name: 'Mid Left Accent Dot',
    category: 'accents',
    x: 74, y: 260, w: 6, h: 20,
    depth: 8,
    scrollStart: 0.78, scrollEnd: 0.86,
    startDx: -45, startDy: 25, startDz: 25,
    startRotateX: 15, startRotateY: -15, startRotateZ: 10,
    initialOpacity: 0.0,
    primaryColor: '#00E5FF', secondaryColor: '#087FF0'
  },
  {
    id: 'acc_inner_needle',
    name: 'Inner Hook Needle Line',
    category: 'accents',
    x: 322, y: 90, w: 4, h: 145,
    depth: 8,
    scrollStart: 0.80, scrollEnd: 0.87,
    startDx: 30, startDy: 20, startDz: 30,
    startRotateX: 20, startRotateY: -10, startRotateZ: 15,
    initialOpacity: 0.0,
    primaryColor: '#00E5FF', secondaryColor: '#087FF0'
  },
  {
    id: 'acc_br_dash',
    name: 'Bottom Right Accent Dash',
    category: 'accents',
    x: 320, y: 415, w: 45, h: 5,
    depth: 6,
    scrollStart: 0.82, scrollEnd: 0.88,
    startDx: 35, startDy: 30, startDz: 20,
    startRotateX: -15, startRotateY: 15, startRotateZ: -10,
    initialOpacity: 0.0,
    primaryColor: '#00E5FF', secondaryColor: '#087FF0'
  }
];
