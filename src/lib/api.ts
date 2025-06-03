import { GenerateFormData } from '@/components/GenerateWizard';
import { auth, authenticatedFetch } from '@/lib/auth';
import { toast } from '@/components/ui/use-toast';

// Types for API responses
export interface QuestionSetRequest {
  id: string;
  status: 'pending' | 'in_progress' | 'complete' | 'failed';
  progressPct: number;
  error?: string;
  setId?: string;
}

export interface QuestionSetResponse {
  id: string;
  questions: Question[];
}

export interface Question {
  id: string;
  type: 'MCQ' | 'True/False' | 'Fill-in-the-Blank' | 'Short Answer';
  text: string;
  options?: string[];
  answer: string | boolean | number;
}

// OpenRouter API configuration
const OPENROUTER_API_KEY = "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";
const OPENROUTER_MODEL = "openai/gpt-4o-mini";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// API service
export const api = {
  /**
   * Create a new question set generation request
   */
  createQuestionSetRequest: async (formData: GenerateFormData): Promise<string> => {
    try {
      // Check if user is authenticated
      if (!auth.isAuthenticated()) {
        throw new Error('You must be logged in to generate questions');
      }

      // Validate that a document is selected
      if (!formData.documentId) {
        throw new Error('A teacher manual is required to generate questions');
      }
      
      // In a real implementation, this would make an API call to your backend
      // For now, we'll simulate it with a request ID
      const requestId = `req_${Math.random().toString(36).substring(2, 15)}`;
      
      const user = auth.getCurrentUser();
      
      // Store the request data in localStorage for demo purposes
      // In production, this would be handled by your backend
      localStorage.setItem(`request_${requestId}`, JSON.stringify({
        id: requestId,
        formData,
        status: 'pending',
        progressPct: 0,
        createdAt: new Date().toISOString(),
        userId: user?.id || 'anonymous'
      }));
      
      // Start processing in the background
      setTimeout(() => api.processQuestionGeneration(requestId, formData), 1000);
      
      return requestId;
    } catch (error) {
      console.error('Error creating question set request:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
      throw error;
    }
  },

  /**
   * Check the status of a question set generation request
   */
  checkQuestionSetStatus: async (requestId: string): Promise<QuestionSetRequest> => {
    try {
      // Check if user is authenticated
      if (!auth.isAuthenticated()) {
        throw new Error('You must be logged in to check question generation status');
      }
      
      // In a real implementation, this would make an API call to your backend
      // For now, we'll simulate it with localStorage
      const requestData = localStorage.getItem(`request_${requestId}`);
      if (!requestData) {
        throw new Error('Request not found');
      }
      
      const request = JSON.parse(requestData);
      
      // Check if this request belongs to the current user
      const user = auth.getCurrentUser();
      if (user && request.userId && request.userId !== user.id) {
        throw new Error('You do not have permission to access this request');
      }
      
      return {
        id: request.id,
        status: request.status,
        progressPct: request.progressPct,
        error: request.error,
        setId: request.setId
      };
    } catch (error) {
      console.error('Error checking question set status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
      throw error;
    }
  },

  /**
   * Get the generated question set
   */
  getQuestionSet: async (setId: string): Promise<QuestionSetResponse> => {
    try {
      // Check if user is authenticated
      if (!auth.isAuthenticated()) {
        throw new Error('You must be logged in to view question sets');
      }
      
      // In a real implementation, this would make an API call to your backend
      // For now, we'll simulate it with localStorage
      const setData = localStorage.getItem(`set_${setId}`);
      if (!setData) {
        throw new Error('Question set not found');
      }
      
      const questionSet = JSON.parse(setData);
      
      // Check if this question set belongs to the current user
      const user = auth.getCurrentUser();
      if (user && questionSet.userId && questionSet.userId !== user.id) {
        throw new Error('You do not have permission to access this question set');
      }
      
      return questionSet;
    } catch (error) {
      console.error('Error getting question set:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
      throw error;
    }
  },
  
  /**
   * Process the question generation in the background
   * This simulates what would happen on your backend
   */
  processQuestionGeneration: async (requestId: string, formData: GenerateFormData) => {
    try {
      // Update status to in_progress
      let requestData = JSON.parse(localStorage.getItem(`request_${requestId}`) || '{}');
      requestData.status = 'in_progress';
      requestData.progressPct = 10;
      localStorage.setItem(`request_${requestId}`, JSON.stringify(requestData));
      
      // Check if a document is selected - fail if not
      if (!formData.documentId) {
        requestData.status = 'failed';
        requestData.error = 'A teacher manual is required to generate questions';
        localStorage.setItem(`request_${requestId}`, JSON.stringify(requestData));
        return;
      }
      
      // Simulate document retrieval
      await new Promise(resolve => setTimeout(resolve, 1000));
      requestData.progressPct = 20;
      localStorage.setItem(`request_${requestId}`, JSON.stringify(requestData));
      
      // Get document text from the selected teacher manual
      let documentText = "";
      let documentFound = false;
      
      // In a real application, this would fetch the actual document content from the server
      if (formData.documentId.startsWith('tm')) {
        // For predefined teacher manuals, we would extract text from the actual PDF
        // For this demo, we'll use specific content for the SHS Computing manuals
        if (formData.documentId === 'tm4' || (formData.subjectId === 'comp_shs' && formData.strandId === 'comp1')) {
          // Book 1 - Computer Architecture and Organisation
          documentText = `SHS 1 COMPUTING TEACHER'S MANUAL - BOOK 1
          
          STRAND: Computer Architecture and Organisation
          
          SUB-STRAND: Data Storage and Manipulation
          
          LEARNING INDICATORS:
          - Describe data as bit pattern representations
          - Understand the use of Boolean logic and binary
          - Identify types and functions of computer memory
          - Explain the role of cache memory
          - Describe the memory hierarchy
          - Explain the role and functions of the CPU
          
          CONTENT:
          
          1. DATA REPRESENTATION
          Data in computers is stored as binary digits (bits) - 0s and 1s. These bits are organized into bytes (8 bits), 
          which form the basic unit of storage. Different types of data require different encoding schemes:
          
          - Numbers: Represented using binary, octal, or hexadecimal systems
          - Text: ASCII or Unicode encoding assigns binary patterns to characters
          - Images: Bitmap representation where each pixel has a binary value
          - Audio: Sampling of sound waves into binary values
          
          2. BOOLEAN LOGIC
          Boolean logic uses binary values (TRUE/FALSE, 1/0) and logical operations:
          - AND: True only when both inputs are true
          - OR: True when at least one input is true
          - NOT: Inverts the input value
          - XOR: True when inputs are different
          
          3. COMPUTER MEMORY
          Types of memory in a computer system:
          - Primary Memory: RAM (volatile) and ROM (non-volatile)
          - Secondary Memory: Hard drives, SSDs, optical media
          - Cache Memory: High-speed memory that bridges the speed gap between CPU and main memory
          
          4. MEMORY HIERARCHY
          The memory hierarchy organizes storage systems by speed, cost, and capacity:
          - Registers (fastest, smallest)
          - Cache (L1, L2, L3)
          - Main Memory (RAM)
          - Secondary Storage (slowest, largest)
          
          5. CPU ARCHITECTURE
          The Central Processing Unit (CPU) consists of:
          - Control Unit: Coordinates operations
          - Arithmetic Logic Unit (ALU): Performs calculations
          - Registers: Small, high-speed storage locations
          - Cache: High-speed memory for frequently accessed data
          
          The CPU follows the fetch-decode-execute cycle to process instructions.`;
          documentFound = true;
        } else if (formData.documentId === 'tm5' || (formData.subjectId === 'comp_shs' && (formData.strandId === 'comp2' || formData.strandId === 'comp3'))) {
          // Book 2 - Computational Thinking (Programming Logic and Web Development)
          documentText = `SHS 1 COMPUTING TEACHER'S MANUAL - BOOK 2
          
          STRAND: ${formData.strandId === 'comp2' ? 'Computational Thinking (Programming Logic)' : 'Computational Thinking (Web Development)'}
          
          SUB-STRAND: ${formData.subStrandId ? subStrandIdToName(formData.subStrandId) : 'Programming Concepts'}
          
          CONTENT:
          
          1. PROGRAMMING FUNDAMENTALS
          Programming is the process of creating a set of instructions that tell a computer how to perform a task.
          Programming languages provide the rules for writing these instructions.
          
          2. ALGORITHM DEVELOPMENT
          An algorithm is a step-by-step procedure for solving a problem or accomplishing a task.
          Key characteristics of algorithms:
          - Finiteness: An algorithm must terminate after a finite number of steps
          - Definiteness: Each step must be precisely defined
          - Input: An algorithm has zero or more inputs
          - Output: An algorithm has one or more outputs
          - Effectiveness: All operations must be basic enough to be performed exactly
          
          3. DATA TYPES AND STRUCTURES
          Data types define the kind of data a variable can hold:
          - Primitive types: Integer, Float, Character, Boolean
          - Complex types: Arrays, Strings, Records/Structs
          
          Data structures organize and store data:
          - Arrays: Collection of elements with the same data type
          - Linked Lists: Elements with pointers to next element
          - Stacks: Last-In-First-Out (LIFO) structure
          - Queues: First-In-First-Out (FIFO) structure
          
          4. CONTROL STRUCTURES
          Control structures determine the flow of program execution:
          - Sequence: Execute statements in order
          - Selection: Make decisions (if-else, switch)
          - Iteration: Repeat actions (loops: for, while, do-while)
          
          5. WEB DEVELOPMENT BASICS
          Web development involves creating websites and web applications using:
          - HTML: Structure of web pages
          - CSS: Styling and layout
          - JavaScript: Client-side functionality and interactivity
          
          6. DATABASE CONCEPTS
          Databases store and organize data for easy retrieval:
          - Tables: Rows (records) and columns (fields)
          - Queries: Commands to retrieve specific data
          - Relationships: Connections between different tables`;
          documentFound = true;
        } else if (formData.documentId === 'tm7' || (formData.subjectId === 'phy_shs' && ['phy1', 'phy2', 'phy3', 'phy4'].includes(formData.strandId))) {
          // Physics Book 1 - Mechanics and Energy (Sections 1-4)
          documentText = `SHS 1 PHYSICS TEACHER'S MANUAL - BOOK 1
          
          STRAND: ${formData.strandId === 'phy1' ? 'Mechanics and Matter' : 
                   formData.strandId === 'phy2' ? 'Matter and Mechanics' : 
                   formData.strandId === 'phy3' ? 'Energy - Heat' : 'Energy - Waves (Mirrors, Reflection, and Refraction)'}
          
          SUB-STRAND: ${formData.subStrandId ? subStrandIdToName(formData.subStrandId) : 'Physics Concepts'}
          
          CONTENT:
          
          ${formData.strandId === 'phy1' ? `
          1. INTRODUCTION TO PHYSICS
          Physics is the natural science that studies matter, its fundamental constituents, its motion and behavior through space and time, and the related entities of energy and force. It is one of the most fundamental scientific disciplines, with its main goal being to understand how the universe behaves.
          
          Applications of Physics in Various Sectors:
          - Engineering: Principles of mechanics and materials science in construction
          - Medicine: Medical imaging technologies like X-rays, MRI, and ultrasound
          - Technology: Electronics, telecommunications, and computer systems
          - Energy: Power generation, renewable energy technologies
          - Transportation: Vehicle design, aerodynamics, and propulsion systems
          
          Basic and Derived Units:
          - Base SI units: meter (length), kilogram (mass), second (time), ampere (electric current), kelvin (temperature), mole (amount of substance), candela (luminous intensity)
          - Derived units: newton (force), joule (energy), watt (power), pascal (pressure), volt (electric potential)
          
          Errors in Measurement:
          - Systematic errors: Consistent, reproducible inaccuracies
          - Random errors: Unpredictable fluctuations in measurements
          - Absolute error: The difference between measured and actual value
          - Relative error: The ratio of absolute error to the actual value
          - Percentage error: Relative error expressed as a percentage
          
          Scalars and Vectors:
          - Scalar quantities: Described by magnitude alone (e.g., mass, time, temperature)
          - Vector quantities: Described by both magnitude and direction (e.g., force, velocity, displacement)
          - Vector operations: Addition, subtraction, multiplication
          - Vector resolution: Breaking down vectors into components
          
          2. MATTER
          States of Matter:
          - Solid: Definite shape and volume, particles tightly packed with strong forces
          - Liquid: Definite volume but takes the shape of its container, particles have some freedom of movement
          - Gas: No definite shape or volume, particles move freely with weak forces
          - Plasma: Ionized gas where electrons are separated from nuclei
          
          Molecular Arrangement:
          - Solids: Regular, ordered arrangement with strong bonds
          - Liquids: Irregular arrangement with intermediate bonds
          - Gases: Random arrangement with weak or no bonds
          - Phase transitions: Changes between states due to energy transfer` 
          
          : formData.strandId === 'phy2' ? `
          1. KINEMATICS
          Types of Motion:
          - Linear motion: Movement along a straight line
          - Circular motion: Movement along a circular path
          - Rotational motion: Spinning or turning around an axis
          - Periodic motion: Motion that repeats at regular intervals
          
          Equations of Motion (for constant acceleration):
          - v = u + at (final velocity equals initial velocity plus acceleration times time)
          - s = ut + ½at² (displacement equals initial velocity times time plus half acceleration times time squared)
          - v² = u² + 2as (final velocity squared equals initial velocity squared plus twice acceleration times displacement)
          - s = ½(u + v)t (displacement equals average velocity times time)
          
          Graphical Representation:
          - Position-time graphs: Slope represents velocity
          - Velocity-time graphs: Slope represents acceleration, area represents displacement
          - Acceleration-time graphs: Area represents change in velocity
          
          2. DYNAMICS
          Newton's Laws of Motion:
          - First Law: An object at rest stays at rest, and an object in motion stays in motion with constant velocity unless acted upon by an external force (Law of Inertia)
          - Second Law: The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass (F = ma)
          - Third Law: For every action, there is an equal and opposite reaction
          
          Force, Mass, and Acceleration:
          - Force causes acceleration
          - Acceleration is directly proportional to force (a ∝ F)
          - Acceleration is inversely proportional to mass (a ∝ 1/m)
          - F = ma expresses the quantitative relationship
          
          3. PRESSURE
          Pressure in Fluids:
          - Pressure is force per unit area (P = F/A)
          - Hydrostatic pressure increases with depth (P = ρgh)
          - Pressure acts equally in all directions in a fluid
          
          Pascal's Principle:
          - Pressure applied to an enclosed fluid is transmitted undiminished to all parts of the fluid and to the walls of the container
          - Forms the basis for hydraulic systems
          
          Applications:
          - Hydraulic brakes: Convert small force over large distance to large force over small distance
          - Hydraulic press: Multiplies force based on the ratio of cross-sectional areas
          - Hydraulic lifts: Used in automotive service stations and construction`
          
          : formData.strandId === 'phy3' ? `
          1. HEAT
          Thermometric Substances:
          - Mercury: Used in conventional thermometers due to its regular expansion
          - Alcohol: Used for low-temperature measurements
          - Gases: Used in gas thermometers, following gas laws
          - Electrical resistance: Used in resistance thermometers
          - Thermocouples: Generate voltage proportional to temperature difference
          
          Thermometers:
          - Mercury-in-glass: Traditional clinical and laboratory thermometer
          - Alcohol thermometer: For measuring very low temperatures
          - Gas thermometer: More accurate over wider range
          - Resistance thermometer: Uses change in electrical resistance with temperature
          - Thermocouple: Uses voltage generated at junction of two different metals
          
          Temperature Scales:
          - Celsius (°C): 0°C at water's freezing point, 100°C at water's boiling point at standard pressure
          - Fahrenheit (°F): 32°F at water's freezing point, 212°F at water's boiling point
          - Kelvin (K): Absolute scale where 0 K is absolute zero, 273.15 K equals 0°C
          
          Temperature Scale Relationships:
          - Celsius to Fahrenheit: °F = (°C × 9/5) + 32
          - Fahrenheit to Celsius: °C = (°F - 32) × 5/9
          - Celsius to Kelvin: K = °C + 273.15
          - Kelvin to Celsius: °C = K - 273.15`
          
          : `
          1. WAVES - REFLECTION AND MIRRORS
          Laws of Reflection:
          - The incident ray, the reflected ray, and the normal to the surface at the point of incidence all lie in the same plane
          - The angle of incidence equals the angle of reflection
          
          Image Formation in Plane Mirrors:
          - Images are virtual (appear to be behind the mirror)
          - Images are laterally inverted (left appears right and vice versa)
          - Image distance behind mirror equals object distance in front of mirror
          - Image size equals object size
          
          Images Formed by Inclined Mirrors:
          - Two mirrors at an angle θ form (360°/θ - 1) images
          - Images are symmetrically arranged around the mirrors
          
          Spherical Mirrors Terminology:
          - Concave mirror: Reflecting surface curves inward
          - Convex mirror: Reflecting surface curves outward
          - Principal axis: Line passing through the center of curvature and the pole
          - Center of curvature: Center of the sphere of which the mirror is a part
          - Focal point: Point where parallel rays converge (concave) or appear to diverge from (convex)
          - Focal length: Distance from the pole to the focal point
          
          Image Formation in Spherical Mirrors:
          - Ray diagrams: Used to locate images graphically
          - Mirror formula: 1/f = 1/v + 1/u (where f is focal length, v is image distance, u is object distance)
          - Magnification: m = -v/u = height of image / height of object
          
          Laws of Refraction:
          - The incident ray, the refracted ray, and the normal to the surface at the point of incidence all lie in the same plane
          - Snell's Law: n₁sin(θ₁) = n₂sin(θ₂) (where n₁ and n₂ are refractive indices, θ₁ is angle of incidence, θ₂ is angle of refraction)`}`;
          documentFound = true;
        } else if (formData.documentId === 'tm8' || (formData.subjectId === 'phy_shs' && ['phy5', 'phy6', 'phy7', 'phy8'].includes(formData.strandId))) {
          // Physics Book 2 - Electromagnetism and Atomic Physics (Sections 5-8)
          documentText = `SHS 1 PHYSICS TEACHER'S MANUAL - BOOK 2
          
          STRAND: ${formData.strandId === 'phy5' ? 'Energy - Waves (Behaviour of Light Through Media)' : 
                   formData.strandId === 'phy6' ? 'Electromagnetism - Electrostatics and Magnetostatics' : 
                   formData.strandId === 'phy7' ? 'Electromagnetism - Analogue Electronics' : 'Atomic and Nuclear Physics'}
          
          SUB-STRAND: ${formData.subStrandId ? subStrandIdToName(formData.subStrandId) : 'Physics Concepts'}
          
          CONTENT:
          
          ${formData.strandId === 'phy5' ? `
          1. WAVES - REFRACTION AND LIGHT BEHAVIOR
          Refractive Index:
          - Refractive index (n) is the ratio of the speed of light in vacuum to the speed of light in a medium
          - n = c/v (where c is speed of light in vacuum, v is speed of light in medium)
          - n = sin(i)/sin(r) (where i is angle of incidence, r is angle of refraction)
          - Refractive index determines how much light bends when entering a medium
          
          Total Internal Reflection:
          - Occurs when light traveling from a denser to a less dense medium strikes the boundary at an angle greater than the critical angle
          - Critical angle: The angle of incidence that produces an angle of refraction of 90°
          - sin(critical angle) = n₂/n₁ (where n₁ is refractive index of denser medium, n₂ is refractive index of less dense medium)
          - Applications: Fiber optics, prisms, diamond brilliance
          
          Real and Apparent Depth:
          - Apparent depth is less than real depth due to refraction
          - Relationship: Apparent depth = Real depth / Refractive index
          - This creates the illusion that objects underwater appear closer to the surface than they actually are`
          
          : formData.strandId === 'phy6' ? `
          1. ELECTROSTATICS
          Gold Leaf Electroscope:
          - Instrument used to detect electric charge and potential
          - Components: Metal cap, metal rod, gold leaf, insulated case
          - Operation: When charged, the gold leaf deflects due to repulsion of like charges
          - Uses: Detecting presence of charge, determining charge type, measuring potential
          
          Electrons as Mobile Charge Carriers:
          - Electrons carry negative charge and can move freely in conductors
          - In metals, the outermost electrons (valence electrons) can move through the crystal lattice
          - Current is the flow of these mobile electrons
          
          Charge Carriers:
          - Conductors: Free electrons
          - Semiconductors: Electrons and holes
          - Electrolytes: Positive and negative ions
          
          Charge Properties:
          - Measured in coulombs (C)
          - Two types: positive and negative
          - Like charges repel, unlike charges attract
          - Charge is quantized (comes in discrete amounts, multiples of elementary charge)
          
          Distribution of Charges:
          - Charges distribute themselves on the outer surface of a conductor
          - Highest charge density occurs at points with smallest radius of curvature
          - Inside a hollow conductor, the electric field is zero
          
          Conservation of Charge:
          - Total charge in an isolated system remains constant
          - Charge cannot be created or destroyed, only transferred
          
          2. MAGNETOSTATICS
          Magnetic and Non-Magnetic Materials:
          - Ferromagnetic: Strongly attracted to magnets (iron, nickel, cobalt)
          - Paramagnetic: Weakly attracted to magnets (aluminum, platinum)
          - Diamagnetic: Weakly repelled by magnets (copper, gold, water)
          
          Magnetic Field:
          - Region around a magnet where its influence can be detected
          - Represented by field lines running from north to south pole
          - Measured in tesla (T)
          
          Magnetization and Demagnetization:
          - Magnetization: Aligning magnetic domains in a material
          - Methods: Stroking with a magnet, electric current, heating and cooling in a magnetic field
          - Demagnetization: Randomizing magnetic domains
          - Methods: Heating above Curie temperature, hammering, alternating current with decreasing amplitude`
          
          : formData.strandId === 'phy7' ? `
          1. ANALOGUE ELECTRONICS
          Semiconductors:
          - N-Type: Silicon or germanium doped with pentavalent impurities (e.g., phosphorus)
          - Majority charge carriers are electrons
          - Contains "extra" electrons that are free to move
          
          - P-Type: Silicon or germanium doped with trivalent impurities (e.g., boron)
          - Majority charge carriers are holes
          - Contains "missing" electrons or "holes" that can move
          
          P-N Junction Diodes:
          - Created by joining p-type and n-type semiconductors
          - Forms a depletion region at the junction
          - Allows current to flow in one direction only (forward bias)
          - Blocks current in the opposite direction (reverse bias)
          - Applications: Rectification, signal detection, voltage regulation
          
          Special Diodes:
          - LED (Light Emitting Diode): Emits light when forward biased
          - Zener Diode: Designed to operate in reverse breakdown region for voltage regulation
          
          Effect of Temperature on Resistance:
          - In metals: Resistance increases with temperature
          - In semiconductors: Resistance decreases with temperature
          - Temperature coefficient of resistance (α) quantifies this relationship
          
          Transducers:
          - Devices that convert one form of energy to another
          - Input transducers: Convert physical quantities to electrical signals
          - Output transducers: Convert electrical signals to physical quantities
          
          Transducer Examples:
          - Microphone: Converts sound to electrical signals
          - Speaker: Converts electrical signals to sound
          - Thermistor: Changes resistance with temperature
          - Photoresistor: Changes resistance with light intensity
          - Strain gauge: Changes resistance with mechanical deformation
          
          Bipolar Junction Transistor (BJT):
          - Three-layer semiconductor device (either PNP or NPN)
          - Three terminals: Emitter, Base, Collector
          - Current amplification device where small base current controls larger collector current
          - Current gain (β or hFE) = Collector current / Base current
          
          Transistor Biasing:
          - Setting up DC voltages and currents to establish proper operating point
          - Types: Fixed bias, collector feedback bias, voltage divider bias
          - Proper biasing prevents distortion and ensures linear operation
          
          Transistor Configurations:
          - Common Emitter: High voltage and current gain, phase inversion
          - Common Collector (Emitter Follower): High current gain, no voltage gain, no phase inversion
          - Common Base: High voltage gain, no current gain, no phase inversion`
          
          : `
          1. ATOMIC PHYSICS
          Atomic Models:
          - Dalton's model: Atoms as indivisible particles
          - Thomson's "plum pudding" model: Electrons embedded in a positive sphere
          - Rutherford's nuclear model: Dense, positive nucleus with electrons orbiting
          - Bohr's model: Electrons in fixed energy levels or shells
          - Quantum mechanical model: Electrons described by wave functions in orbitals
          
          Limitations of Models:
          - Dalton: Didn't account for subatomic particles
          - Thomson: Failed to explain Rutherford's scattering experiment
          - Rutherford: Couldn't explain atomic stability (electrons should spiral into nucleus)
          - Bohr: Only worked well for hydrogen, couldn't explain spectral lines of complex atoms
          
          Electron Transitions:
          - Electrons can move between energy levels by absorbing or emitting energy
          - Energy levels are quantized (discrete)
          - When electrons drop to lower energy levels, they emit photons
          - Energy of photon = Energy difference between levels (E = hf)
          - Produces characteristic spectral lines unique to each element
          
          2. NUCLEAR PHYSICS
          Structure of the Nucleus:
          - Composed of protons (positive charge) and neutrons (neutral)
          - Collectively called nucleons
          - Held together by the strong nuclear force
          - Nuclear size approximately proportional to cube root of mass number
          
          Radioactivity:
          - Spontaneous emission of radiation from unstable nuclei
          - Types of radiation:
            - Alpha (α): Helium nuclei (2 protons, 2 neutrons)
            - Beta (β): Electrons or positrons
            - Gamma (γ): High-energy electromagnetic radiation
          - Decay processes change the atomic number and/or mass number
          
          Nuclear Reactions:
          - Balancing nuclear equations: Total nucleon number and charge must be conserved
          - Notation: ₂₇X (where Z is atomic number, A is mass number, X is element symbol)
          - Example: ₂₃₈U → ₂₃₄Th + ₄He (alpha decay)
          - Nuclear fission: Heavy nucleus splits into lighter nuclei
          - Nuclear fusion: Light nuclei combine to form heavier nucleus`}`;
          documentFound = true;
        } else {
          // For other predefined manuals
          documentText = `Teacher manual content for ${formData.classLevel} 
          ${formData.classGrade} ${formData.subjectId} curriculum. 
          It covers the strand ${formData.strandId} and sub-strand ${formData.subStrandId}.
          
          The manual includes detailed lesson plans, teaching strategies, and assessment methods
          aligned with the Ghana Standard-Based Curriculum.`;
          documentFound = true;
        }
      } else if (formData.documentId.startsWith('uploaded_')) {
        // For uploaded files, in a real app we would extract the text content
        documentText = "This is the extracted content from the uploaded teacher manual file.";
        documentFound = true;
      }
      
      // If no document content was found, fail the request
      if (!documentFound) {
        requestData.status = 'failed';
        requestData.error = 'Could not read the teacher manual content';
        localStorage.setItem(`request_${requestId}`, JSON.stringify(requestData));
        return;
      }
      
      requestData.progressPct = 30;
      localStorage.setItem(`request_${requestId}`, JSON.stringify(requestData));
      
      // Prepare curriculum context
      const curriculum = {
        level: formData.classLevel,
        subject: formData.subjectId, // In production, you'd resolve IDs to actual names
        strand: formData.strandId,
        subStrand: formData.subStrandId
      };
      
      requestData.progressPct = 40;
      localStorage.setItem(`request_${requestId}`, JSON.stringify(requestData));
      
      // Generate questions using OpenRouter API
      try {
        const questions = await generateQuestionsWithAI(
          documentText,
          curriculum,
          formData.questionTypes,
          formData.additionalNotes
        );
        
        requestData.progressPct = 90;
        localStorage.setItem(`request_${requestId}`, JSON.stringify(requestData));
        
        // Get current user
        const user = auth.getCurrentUser();
        
        // Create the question set
        const setId = `set_${Math.random().toString(36).substring(2, 15)}`;
        const questionSet: QuestionSetResponse & { userId?: string } = {
          id: setId,
          questions,
          userId: user?.id
        };
        
        // Store the question set
        localStorage.setItem(`set_${setId}`, JSON.stringify(questionSet));
        
        // Mark the request as complete
        requestData.status = 'complete';
        requestData.progressPct = 100;
        requestData.setId = setId;
        localStorage.setItem(`request_${requestId}`, JSON.stringify(requestData));
      } catch (error) {
        console.error('Error generating questions:', error);
        requestData.status = 'failed';
        requestData.error = error instanceof Error ? error.message : 'Unknown error';
        localStorage.setItem(`request_${requestId}`, JSON.stringify(requestData));
      }
    } catch (error) {
      console.error('Error processing question generation:', error);
      // Update status to failed
      const requestData = JSON.parse(localStorage.getItem(`request_${requestId}`) || '{}');
      requestData.status = 'failed';
      requestData.error = error instanceof Error ? error.message : 'Unknown error';
      localStorage.setItem(`request_${requestId}`, JSON.stringify(requestData));
    }
  },
  
  /**
   * Save edited questions
   */
  saveQuestionSet: async (setId: string, questions: Question[]): Promise<void> => {
    try {
      // Check if user is authenticated
      if (!auth.isAuthenticated()) {
        throw new Error('You must be logged in to save questions');
      }
      
      // In a real implementation, this would make an API call to your backend
      // For now, we'll simulate it with localStorage
      const setData = localStorage.getItem(`set_${setId}`);
      if (!setData) {
        throw new Error('Question set not found');
      }
      
      const questionSet = JSON.parse(setData);
      
      // Check if this question set belongs to the current user
      const user = auth.getCurrentUser();
      if (user && questionSet.userId && questionSet.userId !== user.id) {
        throw new Error('You do not have permission to modify this question set');
      }
      
      // Update the questions
      questionSet.questions = questions;
      questionSet.updatedAt = new Date().toISOString();
      
      // Save back to localStorage
      localStorage.setItem(`set_${setId}`, JSON.stringify(questionSet));
    } catch (error) {
      console.error('Error saving question set:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
      throw error;
    }
  },
  
  /**
   * Export question set to Word document (doc format)
   */
  exportToWord: async (setId: string): Promise<void> => {
    try {
      // Fetch the question set
      const questionSet = await api.getQuestionSet(setId);
      
      if (!questionSet || !questionSet.questions) {
        throw new Error('Question set not found');
      }
      
      // Group questions by type
      const mcqs = questionSet.questions.filter(q => q.type === 'MCQ');
      const trueFalse = questionSet.questions.filter(q => q.type === 'True/False');
      const fillInBlanks = questionSet.questions.filter(q => q.type === 'Fill-in-the-Blank');
      const shortAnswers = questionSet.questions.filter(q => q.type === 'Short Answer');
      
      // Create HTML content for Word document
      let content = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Exam Questions</title>
          <style>
            body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; }
            h1 { font-size: 16pt; text-align: center; margin-bottom: 20px; }
            h2 { font-size: 14pt; margin-top: 30px; margin-bottom: 10px; }
            .question { margin-bottom: 20px; }
            .space-for-answer { height: 30px; border-bottom: 1px solid #ccc; margin: 10px 0; }
            .answer { font-weight: bold; color: #2E7D32; margin-top: 5px; }
            @media print {
              .page-break { page-break-before: always; }
            }
          </style>
        </head>
        <body>
          <h1>Generated Exam Questions - Set ${setId.substring(4, 9)}</h1>
      `;
      
      // Format MCQ questions
      if (mcqs.length > 0) {
        content += `<h2>MULTIPLE CHOICE QUESTIONS</h2>`;
        mcqs.forEach((q: Question, index: number) => {
          content += `<div class="question">`;
          content += `<p><strong>${index + 1}.</strong> ${q.text}</p>`;
          
          if (q.options && q.options.length > 0) {
            q.options.forEach((option, optIndex) => {
              const letter = String.fromCharCode(65 + optIndex); // A, B, C, D
              const isCorrect = optIndex === (q.answer as number);
              content += `<p style="margin-left: 20px;">${letter}. ${option}</p>`;
            });
          }

          // Add the correct answer
          if (q.options && typeof q.answer === 'number' && q.answer >= 0 && q.answer < q.options.length) {
            const correctLetter = String.fromCharCode(65 + (q.answer as number));
            const correctOption = q.options[q.answer as number];
            content += `<p class="answer">Correct Answer: ${correctLetter}. ${correctOption}</p>`;
          }
          
          content += `</div>`;
        });
      }
      
      // Format True/False questions
      if (trueFalse.length > 0) {
        content += `<h2>TRUE/FALSE QUESTIONS</h2>`;
        trueFalse.forEach((q: Question, index: number) => {
          content += `<div class="question">`;
          content += `<p><strong>${index + 1}.</strong> ${q.text}</p>`;
          content += `<p>True/False</p>`;
          content += `<p class="answer">Correct Answer: ${q.answer ? 'True' : 'False'}</p>`;
          content += `</div>`;
        });
      }
      
      // Format Fill-in-the-Blank questions
      if (fillInBlanks.length > 0) {
        content += `<h2>FILL-IN-THE-BLANK QUESTIONS</h2>`;
        fillInBlanks.forEach((q: Question, index: number) => {
          content += `<div class="question">`;
          content += `<p><strong>${index + 1}.</strong> ${q.text}</p>`;
          content += `<p class="answer">Correct Answer: ${q.answer}</p>`;
          content += `</div>`;
        });
      }
      
      // Format Short Answer questions
      if (shortAnswers.length > 0) {
        content += `<h2>SHORT ANSWER QUESTIONS</h2>`;
        shortAnswers.forEach((q: Question, index: number) => {
          content += `<div class="question">`;
          content += `<p><strong>${index + 1}.</strong> ${q.text}</p>`;
          content += `<div class="space-for-answer"></div>`;
          content += `<p class="answer">Correct Answer: ${q.answer}</p>`;
          content += `</div>`;
        });
      }
      
      content += `
        </body>
        </html>
      `;
      
      // Create a blob and trigger download
      const blob = new Blob([content], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `exam-questions-${setId}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: "Your questions have been exported to Word (DOC).",
      });
    } catch (error) {
      console.error('Error exporting to Word:', error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
      throw error;
    }
  }
};

/**
 * Generate questions using OpenRouter API with the specified model
 */
async function generateQuestionsWithAI(
  documentText: string, 
  curriculum: { level: string, subject: string, strand: string, subStrand: string },
  questionTypes: Array<{ type: string, count: number }>,
  notes?: string
): Promise<Question[]> {
  try {
    // Prepare the prompt for the AI
    const prompt = `
    You are an expert educational content creator specializing in creating exam questions for Ghanaian students following the Ghana Standard-Based Curriculum.
    
    IMPORTANT: You MUST use the provided teacher manual content to generate questions. The questions should be based ONLY on the information contained in the teacher manual.
    
    Create high-quality, age-appropriate exam questions based on the following parameters:
    - Educational Level: ${curriculum.level} (${curriculum.level === 'JHS' ? 'Junior High School' : 'Senior High School'})
    - Class Grade: ${curriculum.level === 'JHS' ? 'BS7/BS8/BS9' : 'SHS1/SHS2/SHS3'}
    - Subject: ${curriculum.subject}
    - Strand: ${curriculum.strand}
    - Sub-Strand: ${curriculum.subStrand}
    
    Question types to generate:
    ${questionTypes.map(qt => `- ${qt.count} ${qt.type} questions`).join('\n')}
    
    Additional notes: ${notes || 'None'}
    
    IMPORTANT INSTRUCTIONS:
    1. All questions MUST be based on the teacher manual content provided below.
    2. All questions MUST strictly follow the Ghana Standard-Based Curriculum for the specified subject, strand, and sub-strand.
    3. Questions should be culturally relevant to Ghanaian students and use local contexts when appropriate.
    4. Use appropriate difficulty level for the specified educational level and grade.
    5. For MCQs:
       - Always provide exactly 4 options (A, B, C, D)
       - ONE option must be correct
       - The other 3 options should be plausible but incorrect
       - The "answer" field must contain the index of the correct option (0 for A, 1 for B, 2 for C, 3 for D)
    6. For True/False questions:
       - Make sure the statement is clearly either true or false
       - The "answer" field must be a boolean (true or false)
    7. For Fill-in-the-Blank questions:
       - Use a clear underline or blank space where the answer should go
       - The "answer" field must contain the exact word or phrase that should fill the blank
    8. For Short Answer questions:
       - Ensure they are concise and have specific expected answers
       - The "answer" field must contain a clear, concise model answer
    9. DO NOT generate questions about topics that are not covered in the teacher manual content.
    10. EVERY question MUST have a corresponding answer that is correct, clear, and unambiguous.
    
    Format the output in the following structure for each question type:
    
    MCQ questions:
    1. [Question text]
    A. [Option A]
    B. [Option B]
    C. [Option C]
    D. [Option D]
    Answer: [Letter of correct option and explanation]
    
    True/False questions:
    1. [Question text]
    Answer: [True/False and explanation of why]
    
    Fill-in-the-Blank questions:
    1. [Question text with _____ for blanks]
    Answer: [Word or phrase that fills the blank]
    
    Short Answer questions:
    1. [Question text]
    Answer: [Expected short answer response]
    
    TEACHER MANUAL CONTENT:
    ${documentText}
    
    Return the questions in JSON format as an array of objects with the following structure:
    {
      "id": "unique_id",
      "type": "question_type",
      "text": "question_text",
      "options": ["option1", "option2", "option3", "option4"], // Only for MCQ
      "answer": "correct_answer" // Index for MCQ (0-3), boolean for True/False, string for others
    }
    `;

    // Make the API call to OpenRouter
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin, // Required by OpenRouter
        'X-Title': 'Exam Genius Ghana' // Optional - your app name
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "system",
            content: "You are an AI assistant that specializes in creating educational content for Ghanaian students."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    let parsedQuestions;
    try {
      const jsonResponse = JSON.parse(content);
      parsedQuestions = jsonResponse.questions || [];
      
      // Ensure each question has an ID
      parsedQuestions = parsedQuestions.map((q: any, index: number) => ({
        ...q,
        id: q.id || `q_${Math.random().toString(36).substring(2, 9)}_${index}`
      }));
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Failed to parse AI response');
    }
    
    return parsedQuestions;
  } catch (error) {
    console.error('Error generating questions with AI:', error);
    throw error;
  }
}

// Helper function to convert sub-strand ID to a readable name
function subStrandIdToName(subStrandId: string): string {
  const subStrandMap: {[key: string]: string} = {
    // Computing sub-strands
    'comp1_1': 'Data Storage and Manipulation',
    'comp1_2': 'Computer Hardware and Software',
    'comp1_3': 'Data Communication and Network Systems',
    'comp2_1': 'App Development',
    'comp2_2': 'Algorithm and Data Structure',
    'comp2_3': 'Data Types and Structures',
    'comp2_4': 'Advanced Data Structures',
    'comp2_5': 'Programming with Python',
    'comp3_1': 'Web Technologies and Databases',
    
    // Physics sub-strands
    'phy1_1': 'Introduction to Physics',
    'phy1_2': 'Matter',
    'phy2_1': 'Kinematics',
    'phy2_2': 'Dynamics',
    'phy2_3': 'Pressure',
    'phy3_1': 'Heat',
    'phy4_1': 'Waves - Reflection and Mirrors',
    'phy5_1': 'Waves - Refraction and Light Behavior',
    'phy6_1': 'Electrostatics',
    'phy6_2': 'Magnetostatics',
    'phy7_1': 'Analogue Electronics',
    'phy8_1': 'Atomic Physics',
    'phy8_2': 'Nuclear Physics'
  };
  
  return subStrandMap[subStrandId] || subStrandId;
}

export default api; 