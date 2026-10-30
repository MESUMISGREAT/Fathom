// Meanings used to build "Key to the symbols" blocks (see symbols.mjs).
// Lookup order for a symbol: "<subject>:<topic>", "<subject>:<section>", "<subject>", "common".
// A letter can mean different things in different topics, so keep entries as local as they need to be.
// Subscripted symbols not listed explicitly get "<base meaning> (<qualifier>)" from QUALIFIER.
export const DICT = {
  // Letters that are the unknown or a generic constant in the sentence they sit in; never keyed.
  generic: {
    '9709': ['x', 'y', 'n', 'a', 'b', 'c', 'k', 'm', 'p', 'q', 'f', 'g', 'h', 'i', 'j', 'e', 'd', 'u', 'w', 'z', 'r', 's', 't'],
    '9702': ['x', 'y', 'n', 'k', 'i', 'j', 'e', 'z', 'c'],
  },
  common: { '\\Delta': 'a change in, so $\\Delta v$ means "the change in $v$"', '\\theta': 'an angle', '\\alpha': 'an angle', '\\beta': 'an angle' },
  '9702': {
    'v': 'velocity', 'u': 'initial velocity', 's': 'displacement', 't': 'time', 'a': 'acceleration', 'm': 'mass', 'p': 'momentum', 'F': 'force',
    'W': 'work done', 'V': 'potential difference (voltage)', 'I': 'current', 'R': 'resistance', 'Q': 'charge', 'E': 'e.m.f. of the source',
    '\\lambda': 'wavelength', '\\sigma': 'stress', '\\varepsilon': 'strain', '\\eta': 'efficiency', 'A': 'amplitude', 'L': 'length', 'l': 'length',
    'E_P': 'potential energy', 'E_K': 'kinetic energy', '\\phi': 'phase difference', '\\rho': 'density',
  },
  '9702:1': { 'v': 'speed', 'V': 'volume', 'l': 'length', '\\rho': 'density', '\\Delta': 'the uncertainty in', 'F_x': 'the x-component of the force $F$', '\\theta': 'temperature (in °C) or an angle', 'Q': 'charge' },
  '9702:2': { 'r': 'radius of the circle', 'v_y': 'vertical velocity', 'u_y': 'initial vertical velocity', 'u_x': 'horizontal velocity (it stays the same)', 'v': 'final velocity', '\\theta': 'the angle above the horizontal', 's_1': 'displacement in the first stage', 's_2': 'displacement in the second stage' },
  '9702:3': { 'm_1': 'mass of the first object', 'm_2': 'mass of the second object', 'u_1': 'initial velocity of the first object', 'u_2': 'initial velocity of the second object', 'v_1': 'final velocity of the first object', 'v_2': 'final velocity of the second object', 'u_A': 'initial velocity of object A', 'u_B': 'initial velocity of object B', 'v_A': 'final velocity of object A', 'v_B': 'final velocity of object B', 'm_A': 'mass of object A', 'm_B': 'mass of object B', 'p_x': 'the x-component of momentum', 'p_y': 'the y-component of momentum', 'p_A': 'momentum of object A', 'p_B': 'momentum of object B', 'v': 'velocity' },
  '9702:4': { 'W': 'weight', 'H_x': 'horizontal component of the force from the hinge', 'H_y': 'vertical component of the force from the hinge', '\\theta': 'an angle', '\\alpha': 'an angle' },
  '9702:5': { 'E_P': 'gravitational potential energy', 'E_K': 'kinetic energy', '\\eta': 'efficiency' },
  '9702:6': { 'E_P': 'elastic potential energy', '\\sigma': 'stress', '\\varepsilon': 'strain' },
  '9702:7': { 'f': 'frequency', 'd': 'distance travelled by the wave', 'v': 'speed of the wave', 'I_1': 'first (or original) intensity', 'I_2': 'second (or new) intensity', 'I_3': 'third intensity', 'A_1': 'first amplitude', 'A_2': 'second amplitude', '\\theta_1': 'first angle', '\\theta_2': 'second angle' },
  '9702:8': { 'L_1': 'first length', 'L_2': 'second length', 'A_1': 'amplitude of the first wave', 'A_2': 'amplitude of the second wave' },
  '9702:9': { 'W': 'energy transferred (work done)', 'V': 'potential difference', 'Q': 'charge', 'I': 'current', 't': 'time', 'l': 'length of the wire' },
  '9702:10': { 'R_1': 'resistance of the first resistor', 'R_3': 'resistance of the third resistor', 'R_p': 'combined resistance of resistors in parallel', 'R_s': 'combined resistance of resistors in series', 'V_1': 'p.d. across the first component', 'V_s': 'p.d. across the series part', 'V_p': 'p.d. across the parallel part', 'V_R': 'p.d. across the resistor', 'I_1': 'current in the first branch', 'I_2': 'current in the second branch', 'l': 'length' },
  '9709': {},
  '9709:1.1': { '\\alpha': 'one root of the quadratic', '\\beta': 'the other root of the quadratic' },
  '9709:1.3': { 'm_1': 'gradient of the first line', 'm_2': 'gradient of the second line', 'm_{AP}': 'gradient of the line $AP$', 'm_{BP}': 'gradient of the line $BP$', 'm_{AC}': 'gradient of the line $AC$', 'x_1': 'x-coordinate of a known point on the line', 'y_1': 'y-coordinate of a known point on the line' },
  '9709:1.5': { '\\alpha': 'an angle', '\\theta': 'an angle' },
  '9709:1.6': { 'S_1': 'the sum of the first 1 term', 'S_3': 'the sum of the first 3 terms', 'S_8': 'the sum of the first 8 terms', 'S_{10}': 'the sum of the first 10 terms', 'S_{21}': 'the sum of the first 21 terms', 'S_{40}': 'the sum of the first 40 terms', 'u_1': 'the first term of the sequence', 'u_2': 'the second term', 'u_3': 'the third term', 'u_4': 'the fourth term', 'u_n': 'the $n$th term', 'S_n': 'the sum of the first $n$ terms' },
  '9709:3.1': { 'P': 'the polynomial', 'C': 'a constant' },
  '9709:3.4': { 'v_x': 'the rate of change of $x$ with $t$ (horizontal velocity)', 'v_y': 'the rate of change of $y$ with $t$ (vertical velocity)' },
  '9709:3.5': { 'c_1': 'a constant of integration', 'c_2': 'a constant of integration' },
  '9709:3.7': { 'x_1': 'x-component of the first vector', 'y_1': 'y-component of the first vector', 'z_1': 'z-component of the first vector', 'x_2': 'x-component of the second vector', 'y_2': 'y-component of the second vector', 'z_2': 'z-component of the second vector', 'x_A': 'x-coordinate of point $A$', 'y_A': 'y-coordinate of point $A$', 'z_A': 'z-coordinate of point $A$', 'x_B': 'x-coordinate of point $B$', 'y_B': 'y-coordinate of point $B$', 'z_B': 'z-coordinate of point $B$' },
  '9709:3.9': { '\\rho': 'the modulus of $w$', '\\phi': 'the argument of $w$','a_n': 'the coefficient of $x^n$', 'a_1': 'the coefficient of $x$', 'a_0': 'the constant term', 'z_1': 'the first complex number', 'z_2': 'the second complex number', 'r_1': 'the modulus of $z_1$', '\\theta': 'the argument (angle) of a complex number', '\\theta_1': 'the argument of $z_1$', '\\theta_2': 'the argument of $z_2$', '\\alpha': 'an angle', '\\beta': 'an angle' },
  '9709:4': { 'm': 'mass', 'u': 'initial velocity', 'v': 'final velocity', 'F': 'force', 'P': 'power', 'W': 'work done', 'R': 'resistance to motion', 'm_1': 'mass of the first object', 'm_2': 'mass of the second object', 'u_1': 'initial velocity of the first object', 'v_1': 'final velocity of the first object', 'v_2': 'final velocity of the second object', 'F_x': 'the x-component of the force $F$', 'F_y': 'the y-component of the force $F$', 's_1': 'displacement in the first stage', 's_2': 'displacement in the second stage', '\\theta': 'an angle', '\\alpha': 'an angle' },
  '9709:5': { '\\mu': 'the mean', 'z_1': 'the first $z$-value', 'z_2': 'the second $z$-value', 'z_a': 'the $z$-value for $a$', 'z_b': 'the $z$-value for $b$', 'Z': 'the standard normal variable', 'X': 'the random variable' },
  '9709:6': { 'P': 'probability, so $P(X = r)$ means "the probability that $X$ equals $r$"',  'X': 'the random variable', 'Y': 'the random variable', '\\lambda': 'the mean number of events (the Poisson parameter)', 'N': 'a large number of trials', '\\sigma': 'the standard deviation', 'Z': 'the standard normal variable' },
};
