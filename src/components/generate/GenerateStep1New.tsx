import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, AlertCircle, Info, Upload } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { GenerateFormData } from '../GenerateWizard';

interface GenerateStep1Props {
  data: GenerateFormData;
  onUpdate: (updates: Partial<GenerateFormData>) => void;
}

// Mock teacher manual data - in a real app this would come from an API
interface TeacherManual {
  id: string;
  fileName: string;
  classGrade: string;
  subjectId: string;
  fileUrl: string;
}

const GenerateStep1New: React.FC<GenerateStep1Props> = ({ data, onUpdate }) => {
  // State for file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Mock teacher manuals data - in real app, these would come from API
  const teacherManuals: TeacherManual[] = [
    { id: 'tm1', fileName: 'JHS Science BS7 Teacher Manual.pdf', classGrade: 'bs7', subjectId: 'sci_jhs', fileUrl: '/manuals/science/jhs_science_bs7.pdf' },
    { id: 'tm2', fileName: 'JHS Science BS8 Teacher Manual.pdf', classGrade: 'bs8', subjectId: 'sci_jhs', fileUrl: '/manuals/science/jhs_science_bs8.pdf' },
    { id: 'tm3', fileName: 'JHS Math BS7 Teacher Manual.pdf', classGrade: 'bs7', subjectId: 'math_jhs', fileUrl: '/manuals/math/jhs_math_bs7.pdf' },
    { id: 'tm4', fileName: 'SHS Computing Book 1 - Computer Architecture.pdf', classGrade: 'shs1', subjectId: 'comp_shs', fileUrl: '/manuals/computing/shs_computing_book1.pdf' },
    { id: 'tm5', fileName: 'SHS Computing Book 2 - Programming & Web Dev.pdf', classGrade: 'shs1', subjectId: 'comp_shs', fileUrl: '/manuals/computing/shs_computing_book2.pdf' },
    { id: 'tm6', fileName: 'SHS Biology SHS2 Teacher Manual.pdf', classGrade: 'shs2', subjectId: 'bio_shs', fileUrl: '/manuals/biology/shs_biology_shs2.pdf' },
    { id: 'tm7', fileName: 'SHS Physics Book 1 - Mechanics and Energy.pdf', classGrade: 'shs1', subjectId: 'phy_shs', fileUrl: '/manuals/physics/shs_physics_book1.pdf' },
    { id: 'tm8', fileName: 'SHS Physics Book 2 - Electromagnetism and Atomic Physics.pdf', classGrade: 'shs1', subjectId: 'phy_shs', fileUrl: '/manuals/physics/shs_physics_book2.pdf' },
    { id: 'tm9', fileName: 'SHS Biology Book 1 - Sections 1-5.pdf', classGrade: 'shs1', subjectId: 'bio_shs', fileUrl: '/manuals/biology/shs_biology_book1.pdf' },
    { id: 'tm10', fileName: 'SHS Biology Book 2 - Sections 5-8.pdf', classGrade: 'shs1', subjectId: 'bio_shs', fileUrl: '/manuals/biology/shs_biology_book2.pdf' },
    { id: 'tm11', fileName: 'SHS General Science Book 1 - Sections 1-4.pdf', classGrade: 'shs1', subjectId: 'sci_shs', fileUrl: '/manuals/science/shs_general_science_book1.pdf' },
    { id: 'tm12', fileName: 'SHS General Science Book 2 - Sections 5-9.pdf', classGrade: 'shs1', subjectId: 'sci_shs', fileUrl: '/manuals/science/shs_general_science_book2.pdf' },
    { id: 'tm13', fileName: 'SHS Chemistry Year 1 Book 1 and Book 2.pdf', classGrade: 'shs1', subjectId: 'chem_shs', fileUrl: '/manuals/chemistry/SHS 1 Chemistry Year 1 Book 1 and Book2 Teacher-manual.pdf' }
  ];

  const classGrades = {
    JHS: [
      { id: 'bs7', name: 'BS7' },
      { id: 'bs8', name: 'BS8' },
      { id: 'bs9', name: 'BS9' },
    ],
    SHS: [
      { id: 'shs1', name: 'SHS1' },
      { id: 'shs2', name: 'SHS2' },
      { id: 'shs3', name: 'SHS3' },
    ]
  };

  const subjects = {
    JHS: [
      { id: 'sci_jhs', name: 'Science' },
      { id: 'math_jhs', name: 'Mathematics' },
      { id: 'eng_jhs', name: 'English Language' },
      { id: 'ss_jhs', name: 'Social Studies' }
    ],
    SHS: [
      { id: 'bio_shs', name: 'Biology' },
      { id: 'chem_shs', name: 'Chemistry' },
      { id: 'phy_shs', name: 'Physics' },
      { id: 'comp_shs', name: 'Computing' },
      { id: 'sci_shs', name: 'General Science' }
    ]
  };

  const strands = {
    'sci_jhs': [
      { id: 'b7', name: 'Diversity of Matter' },
      { id: 'b8', name: 'Cycles' },
      { id: 'b9', name: 'Systems' }
    ],
    'math_jhs': [
      { id: 'm1', name: 'Number and Numeration' },
      { id: 'm2', name: 'Measurement' },
      { id: 'm3', name: 'Geometry' }
    ],
    'comp_shs': [
      { id: 'comp1', name: 'Computer Architecture and Organisation' },
      { id: 'comp2', name: 'Computational Thinking (Programming Logic)' },
      { id: 'comp3', name: 'Computational Thinking (Web Development)' }
    ],
    'phy_shs': [
      { id: 'phy1', name: 'Mechanics and Matter' },
      { id: 'phy2', name: 'Matter and Mechanics' },
      { id: 'phy3', name: 'Energy - Heat' },
      { id: 'phy4', name: 'Energy - Waves (Mirrors, Reflection, and Refraction)' },
      { id: 'phy5', name: 'Energy - Waves (Behaviour of Light Through Media)' },
      { id: 'phy6', name: 'Electromagnetism - Electrostatics and Magnetostatics' },
      { id: 'phy7', name: 'Electromagnetism - Analogue Electronics' },
      { id: 'phy8', name: 'Atomic and Nuclear Physics' }
    ],
    'bio_shs': [
      { id: 'bio1', name: 'Introduction to Biology and Scientific Methods' },
      { id: 'bio2', name: 'Fish Farming, Processing and Conservation' },
      { id: 'bio3', name: 'Cell Biology' },
      { id: 'bio4', name: 'Organisms and Classification' },
      { id: 'bio5', name: 'Ecology' },
      { id: 'bio6', name: 'Diseases and Infections' },
      { id: 'bio7', name: 'Mammalian Systems' },
      { id: 'bio8', name: 'Plant Systems' }
    ],
    'chem_shs': [
      { id: 'chem1', name: 'Physical Chemistry - Matter and Its Properties' },
      { id: 'chem2', name: 'Physical Chemistry - Equilibria' },
      { id: 'chem3', name: 'Systematic Chemistry of the Elements - Periodicity' },
      { id: 'chem4', name: 'Systematic Chemistry of the Elements - Bonding' },
      { id: 'chem5', name: 'Chemistry of Carbon Compounds - Characterisation of Organic Compounds' },
      { id: 'chem6', name: 'Chemistry of Carbon Compounds - Organic Functional Groups' }
    ],
    'sci_shs': [
      { id: 'sci1', name: 'Exploring Materials - The Characteristics of Science' },
      { id: 'sci2', name: 'Exploring Materials - Solids and Binary Compounds' },
      { id: 'sci3', name: 'Processes for Living - Diffusion and Osmosis' },
      { id: 'sci4', name: 'Processes for Living - Reproduction in Plants and Humans' },
      { id: 'sci5', name: 'Vigour Behind Life - Solar Panels' },
      { id: 'sci6', name: 'Vigour Behind Life - Force' },
      { id: 'sci7', name: 'Vigour Behind Life - Basic Electronics' },
      { id: 'sci8', name: 'Relationships with the Environment - Promoting Health and Safety' },
      { id: 'sci9', name: 'Relationships with the Environment - Production in Local Industry' }
    ]
  };

  const subStrands = {
    'b7': [
      { id: 'b7_1', name: 'B7.1.3.4 - Photosynthesis in Green Plants' },
      { id: 'b7_2', name: 'B7.2.1.1 - States of Matter' },
      { id: 'b7_3', name: 'B7.3.2.2 - Chemical Reactions' }
    ],
    'b8': [
      { id: 'b8_1', name: 'B8.1.1.1 - Water Cycle' },
      { id: 'b8_2', name: 'B8.2.3.1 - Carbon Cycle' }
    ],
    'comp1': [
      { id: 'comp1_1', name: '1.1: Data Storage and Manipulation' },
      { id: 'comp1_2', name: '1.2: Computer Hardware and Software' },
      { id: 'comp1_3', name: '1.3: Data Communication and Network Systems' }
    ],
    'comp2': [
      { id: 'comp2_1', name: '2.1: App Development' },
      { id: 'comp2_2', name: '2.2: Algorithm and Data Structure' },
      { id: 'comp2_3', name: '2.3: Data Types and Structures' },
      { id: 'comp2_4', name: '2.4: Advanced Data Structures' },
      { id: 'comp2_5', name: '2.5: Programming with Python' }
    ],
    'comp3': [
      { id: 'comp3_1', name: '3.1: Web Technologies and Databases' }
    ],
    'phy1': [
      { id: 'phy1_1', name: 'Introduction to Physics' },
      { id: 'phy1_2', name: 'Matter' }
    ],
    'phy2': [
      { id: 'phy2_1', name: 'Kinematics' },
      { id: 'phy2_2', name: 'Dynamics' },
      { id: 'phy2_3', name: 'Pressure' }
    ],
    'phy3': [
      { id: 'phy3_1', name: 'Heat' }
    ],
    'phy4': [
      { id: 'phy4_1', name: 'Waves - Reflection and Mirrors' }
    ],
    'phy5': [
      { id: 'phy5_1', name: 'Waves - Refraction and Light Behavior' }
    ],
    'phy6': [
      { id: 'phy6_1', name: 'Electrostatics' },
      { id: 'phy6_2', name: 'Magnetostatics' }
    ],
    'phy7': [
      { id: 'phy7_1', name: 'Analogue Electronics' }
    ],
    'phy8': [
      { id: 'phy8_1', name: 'Atomic Physics' },
      { id: 'phy8_2', name: 'Nuclear Physics' }
    ],
    'sci1': [
      { id: 'sci1_1', name: 'Science and Materials in Nature - Characteristics of Science' }
    ],
    'sci2': [
      { id: 'sci2_1', name: 'Science and Materials in Nature - Solids and Binary Compounds' }
    ],
    'sci3': [
      { id: 'sci3_1', name: 'Essentials for Survival - Diffusion and Osmosis' }
    ],
    'sci4': [
      { id: 'sci4_1', name: 'Essentials for Survival - Reproduction' }
    ],
    'sci5': [
      { id: 'sci5_1', name: 'Powering the Future with Energy Forms - Solar Panels' }
    ],
    'sci6': [
      { id: 'sci6_1', name: 'Forces Acting on Substances and Mechanisms' }
    ],
    'sci7': [
      { id: 'sci7_1', name: 'Uses of Electronic Components in Household Electronic Devices' }
    ],
    'sci8': [
      { id: 'sci8_1', name: 'The Human Body and Health' }
    ],
    'sci9': [
      { id: 'sci9_1', name: 'Relationship with the Environment (Local Industry)' }
    ],
    'bio1': [
      { id: 'bio1_1', name: 'Foundations of Biology' }
    ],
    'bio2': [
      { id: 'bio2_1', name: 'Biology and Entrepreneurship' }
    ],
    'bio3': [
      { id: 'bio3_1', name: 'Cell Structure and Function' }
    ],
    'bio4': [
      { id: 'bio4_1', name: 'Ecology' }
    ],
    'bio5': [
      { id: 'bio5_1', name: 'Ecology' }
    ],
    'bio6': [
      { id: 'bio6_1', name: 'Diseases and Infections' }
    ],
    'bio7': [
      { id: 'bio7_1', name: 'Mammalian Systems' }
    ],
    'bio8': [
      { id: 'bio8_1', name: 'Plant Systems' }
    ],
    'chem1': [
      { id: 'chem1_1', name: 'Introduction to Chemistry and Scientific Method' },
      { id: 'chem1_2', name: 'Concept of the Mole' },
      { id: 'chem1_3', name: 'Mole Ratios, Chemical Formulae and Equations' },
      { id: 'chem1_4', name: 'Kinetic Theory and States of Matter' }
    ],
    'chem2': [
      { id: 'chem2_1', name: 'Solubility and Qualitative Analysis' }
    ],
    'chem3': [
      { id: 'chem3_1', name: 'Periodic Properties' }
    ],
    'chem4': [
      { id: 'chem4_1', name: 'Interatomic Bonding' },
      { id: 'chem4_2', name: 'Intermolecular Bonding' }
    ],
    'chem5': [
      { id: 'chem5_1', name: 'Qualitative and Quantitative Analysis of Organic Compounds' }
    ],
    'chem6': [
      { id: 'chem6_1', name: 'Classifications of Organic Compounds' }
    ]
  };

  const learningIndicators = {
    'comp1_1': [
      { id: 'li_comp1_1_1', name: 'Describe data as bit pattern representations' },
      { id: 'li_comp1_1_2', name: 'Understand the use of Boolean logic and binary' },
      { id: 'li_comp1_1_3', name: 'Identify types and functions of computer memory' },
      { id: 'li_comp1_1_4', name: 'Explain the role of cache memory' },
      { id: 'li_comp1_1_5', name: 'Describe the memory hierarchy' },
      { id: 'li_comp1_1_6', name: 'Explain the role and functions of the CPU' },
      { id: 'li_comp1_1_7', name: 'Identify and describe the components of a CPU' },
      { id: 'li_comp1_1_8', name: 'Understand the machine cycle' },
      { id: 'li_comp1_1_9', name: 'Explain the CPU instruction set' },
      { id: 'li_comp1_1_10', name: 'Describe the concept and applications of embedded systems' }
    ],
    'comp1_2': [
      { id: 'li_comp1_2_1', name: 'Identify and explain the functions of input devices' },
      { id: 'li_comp1_2_2', name: 'Identify and explain the functions of output devices' },
      { id: 'li_comp1_2_3', name: 'Classify and explain types of storage devices' },
      { id: 'li_comp1_2_4', name: 'Understand the concept and benefits of cloud storage' },
      { id: 'li_comp1_2_5', name: 'Identify different communication hardware devices' },
      { id: 'li_comp1_2_6', name: 'Understand the functions and components of the motherboard' },
      { id: 'li_comp1_2_7', name: 'Categorize and explain types of computer software' }
    ],
    'comp1_3': [
      { id: 'li_comp1_3_1', name: 'Discuss the advantages of computer networks over stand-alone systems' },
      { id: 'li_comp1_3_2', name: 'Identify and describe components of a computer network' },
      { id: 'li_comp1_3_3', name: 'Differentiate between types of area networks (LAN, WAN, MAN)' },
      { id: 'li_comp1_3_4', name: 'Explain network topologies and their types' },
      { id: 'li_comp1_3_5', name: 'Compare different types of networks' },
      { id: 'li_comp1_3_6', name: 'Understand network architecture' },
      { id: 'li_comp1_3_7', name: 'Explain the concept and use of cloud networks' },
      { id: 'li_comp1_3_8', name: 'Understand the OSI model and its layers' },
      { id: 'li_comp1_3_9', name: 'Explain wireless data connections' },
      { id: 'li_comp1_3_10', name: 'Identify and explain types of wired transmission media' },
      { id: 'li_comp1_3_11', name: 'Compare wired and wireless networks' }
    ],
    'comp2_1': [
      { id: 'li_comp2_1_1', name: 'Identify and describe the stages of the program development cycle' },
      { id: 'li_comp2_1_2', name: 'Understand program analysis' },
      { id: 'li_comp2_1_3', name: 'Learn program design techniques' },
      { id: 'li_comp2_1_4', name: 'Implement programming solutions' },
      { id: 'li_comp2_1_5', name: 'Test and debug programs' }
    ],
    'comp2_2': [
      { id: 'li_comp2_2_1', name: 'Define and explain variables in programming' },
      { id: 'li_comp2_2_2', name: 'Describe an algorithm and its key characteristics with examples' },
      { id: 'li_comp2_2_3', name: 'Explain and provide examples of pseudocode' },
      { id: 'li_comp2_2_4', name: 'Explain and provide examples of flowcharts' }
    ],
    'comp2_3': [
      { id: 'li_comp2_3_1', name: 'Identify and explain various data types with examples' },
      { id: 'li_comp2_3_2', name: 'Understand the importance of data structures in programming' },
      { id: 'li_comp2_3_3', name: 'Classify data structures (Linear vs Non-linear, Static vs Dynamic)' },
      { id: 'li_comp2_3_4', name: 'Describe arrays as a data structure' },
      { id: 'li_comp2_3_5', name: 'Distinguish between one-dimensional and two-dimensional arrays' },
      { id: 'li_comp2_3_6', name: 'Explain the advantages and disadvantages of arrays' }
    ],
    'comp2_4': [
      { id: 'li_comp2_4_1', name: 'Describe linked lists: features, operations, types, examples, applications' },
      { id: 'li_comp2_4_2', name: 'Describe stacks: features, operations, types, examples, applications' },
      { id: 'li_comp2_4_3', name: 'Describe queues: features, operations, examples, applications, advantages' },
      { id: 'li_comp2_4_4', name: 'Identify and describe non-linear data structures (Binary trees, Graphs)' }
    ],
    'comp2_5': [
      { id: 'li_comp2_5_1', name: 'Understand programming basics using Python' },
      { id: 'li_comp2_5_2', name: 'Translate simple algorithms with single variables into Python code' },
      { id: 'li_comp2_5_3', name: 'Implement and manipulate 1D arrays in Python' },
      { id: 'li_comp2_5_4', name: 'Use built-in list methods in Python' }
    ],
    'comp3_1': [
      { id: 'li_comp3_1_1', name: 'Distinguish between web design and web development' },
      { id: 'li_comp3_1_2', name: 'Explain web development and build a basic website' },
      { id: 'li_comp3_1_3', name: 'Identify and describe components of a web page' },
      { id: 'li_comp3_1_4', name: 'Explain the role of a web designer' },
      { id: 'li_comp3_1_5', name: 'Create a web outline plan and describe the steps involved' },
      { id: 'li_comp3_1_6', name: 'Define and illustrate a sitemap' },
      { id: 'li_comp3_1_7', name: 'Explain web page wireframes: purpose and creation' },
      { id: 'li_comp3_1_8', name: 'Describe website prototypes: purpose, creation, and usage' },
      { id: 'li_comp3_1_9', name: 'Explain the advantages of using wireframes and prototypes' }
    ],
    'b7_1': [
      { id: 'li_b7_1_1', name: 'Explain the process of photosynthesis' },
      { id: 'li_b7_1_2', name: 'Identify the raw materials for photosynthesis' },
      { id: 'li_b7_1_3', name: 'Describe the products of photosynthesis' }
    ],
    'phy1_1': [
      { id: 'li_phy1_1_1', name: 'Applications of Physics in Various Sectors of the Economy' },
      { id: 'li_phy1_1_2', name: 'The Interplay of Mathematics and Physics' },
      { id: 'li_phy1_1_3', name: 'Basic and Derived Units' },
      { id: 'li_phy1_1_4', name: 'Dimension' },
      { id: 'li_phy1_1_5', name: 'Errors in the Use of Measuring Instruments' },
      { id: 'li_phy1_1_6', name: 'Errors in Measurement' },
      { id: 'li_phy1_1_7', name: 'Scientific Notations and Their Unit Multipliers' },
      { id: 'li_phy1_1_8', name: 'Scalars and Vectors' }
    ],
    'phy1_2': [
      { id: 'li_phy1_2_1', name: 'States of Matter' },
      { id: 'li_phy1_2_2', name: 'Molecular Arrangement of the Various States of Matter' }
    ],
    'phy2_1': [
      { id: 'li_phy2_1_1', name: 'Types of Motion' },
      { id: 'li_phy2_1_2', name: 'Equations of Motion' },
      { id: 'li_phy2_1_3', name: 'Representation of Motions of Objects Graphically' }
    ],
    'phy2_2': [
      { id: 'li_phy2_2_1', name: 'Newton\'s Laws of Motion' },
      { id: 'li_phy2_2_2', name: 'Relationship Between Force, Mass, and Acceleration' }
    ],
    'phy2_3': [
      { id: 'li_phy2_3_1', name: 'Pressure in a Fluid' },
      { id: 'li_phy2_3_2', name: 'Pascal\'s Principle' },
      { id: 'li_phy2_3_3', name: 'Brake Systems and Hydraulic Press' }
    ],
    'phy3_1': [
      { id: 'li_phy3_1_1', name: 'Thermometric Substances' },
      { id: 'li_phy3_1_2', name: 'Thermometers' },
      { id: 'li_phy3_1_3', name: 'Temperature Scales' },
      { id: 'li_phy3_1_4', name: 'Relationship Between Temperature Scales' }
    ],
    'phy4_1': [
      { id: 'li_phy4_1_1', name: 'Laws of Reflection' },
      { id: 'li_phy4_1_2', name: 'Image Formation in Plane Mirrors' },
      { id: 'li_phy4_1_3', name: 'Images Formed by Inclined Mirrors' },
      { id: 'li_phy4_1_4', name: 'Terminologies Associated with Spherical Mirrors' },
      { id: 'li_phy4_1_5', name: 'Characteristics of Image Formation in Spherical Mirrors' },
      { id: 'li_phy4_1_6', name: 'Laws of Refraction' }
    ],
    'phy5_1': [
      { id: 'li_phy5_1_1', name: 'Refractive Index of a Medium' },
      { id: 'li_phy5_1_2', name: 'Total Internal Reflection' },
      { id: 'li_phy5_1_3', name: 'Relationship Between Real Depth, Apparent Depth, and Refractive Index' }
    ],
    'phy6_1': [
      { id: 'li_phy6_1_1', name: 'Gold Leaf Electroscope' },
      { id: 'li_phy6_1_2', name: 'Electrons as Mobile Charge Carriers' },
      { id: 'li_phy6_1_3', name: 'Charge Carriers in Conductors, Semiconductors' },
      { id: 'li_phy6_1_4', name: 'Charge' },
      { id: 'li_phy6_1_5', name: 'Distribution of Charges on Surfaces' },
      { id: 'li_phy6_1_6', name: 'Positive and Negative Charges' },
      { id: 'li_phy6_1_7', name: 'Conservation of Charge' }
    ],
    'phy6_2': [
      { id: 'li_phy6_2_1', name: 'Magnetic and Non-Magnetic Materials' },
      { id: 'li_phy6_2_2', name: 'Magnetic Field' },
      { id: 'li_phy6_2_3', name: 'Magnetisation and Demagnetisation' }
    ],
    'phy7_1': [
      { id: 'li_phy7_1_1', name: 'N-Type and P-Type Semiconductors' },
      { id: 'li_phy7_1_2', name: 'P-N Junction Diodes' },
      { id: 'li_phy7_1_3', name: 'LEDs and Zener Diodes' },
      { id: 'li_phy7_1_4', name: 'Effect of Temperature Changes on Resistance' },
      { id: 'li_phy7_1_5', name: 'Transducer' },
      { id: 'li_phy7_1_6', name: 'Processes of Some Transducers' },
      { id: 'li_phy7_1_7', name: 'Bipolar Junction Transistor (BJT)' },
      { id: 'li_phy7_1_8', name: 'Transistor Biasing' },
      { id: 'li_phy7_1_9', name: 'Various Transistor Configurations' }
    ],
    'phy8_1': [
      { id: 'li_phy8_1_1', name: 'Atomic Models and Their Limitations' },
      { id: 'li_phy8_1_2', name: 'Transition of an Electron' }
    ],
    'phy8_2': [
      { id: 'li_phy8_2_1', name: 'The Structure of the Nucleus' },
      { id: 'li_phy8_2_2', name: 'Radioactivity' },
      { id: 'li_phy8_2_3', name: 'Balancing Nuclear Reactions' }
    ],
    'sci1_1': [
      { id: 'li_sci1_1_1', name: 'Characteristics of Science in Nature' },
      { id: 'li_sci1_1_2', name: 'Designing Projects Using the Characteristics of Science' },
      { id: 'li_sci1_1_3', name: 'Application of the Characteristics of Science Where Appropriate' }
    ],
    'sci2_1': [
      { id: 'li_sci2_1_1', name: 'Metals, Non-Metals, and Semi-Metals' },
      { id: 'li_sci2_1_2', name: 'Application of Properties of Different Solid Structures in Relation to Their Uses in Life' },
      { id: 'li_sci2_1_3', name: 'Relationship Between Binary Compounds, the Composition of Binary Compounds and the Names of Compounds' },
      { id: 'li_sci2_1_4', name: 'Naming of Binary Compounds' }
    ],
    'sci3_1': [
      { id: 'li_sci3_1_1', name: 'Concepts of Diffusion and Its Application in Life' },
      { id: 'li_sci3_1_2', name: 'Osmosis and Its Application in Our Daily Life' }
    ],
    'sci4_1': [
      { id: 'li_sci4_1_1', name: 'Reproduction in Plants' },
      { id: 'li_sci4_1_2', name: 'Female Reproductive System' },
      { id: 'li_sci4_1_3', name: 'Menstrual Cycle' }
    ],
    'sci5_1': [
      { id: 'li_sci5_1_1', name: 'How Solar Panels Reduce the Reliance on Fossil Fuels in Ghana' },
      { id: 'li_sci5_1_2', name: 'How Solar Panels Are Set Up in Ghana' },
      { id: 'li_sci5_1_3', name: 'Advantages and Disadvantages of Solar Energy to the Economy of Ghana' }
    ],
    'sci6_1': [
      { id: 'li_sci6_1_1', name: 'Identification and Explanation of Concepts Associated with Forces' }
    ],
    'sci7_1': [
      { id: 'li_sci7_1_1', name: 'Uses of Electronic Components in Household Electronic Devices' }
    ],
    'sci8_1': [
      { id: 'li_sci8_1_1', name: 'Hazards and How to Manage Them in the Environment' },
      { id: 'li_sci8_1_2', name: 'Causes, Effects and Prevention of Lifestyle Diseases' },
      { id: 'li_sci8_1_3', name: 'Recreational Drugs and the Negative Effects These Have on the Body and Society' }
    ],
    'sci9_1': [
      { id: 'li_sci9_1_1', name: 'Production of Local Soap' },
      { id: 'li_sci9_1_2', name: 'Experiment to Produce Different Types of Soap' },
      { id: 'li_sci9_1_3', name: 'Identify the Science Underlying the Stages of Production' },
      { id: 'li_sci9_1_4', name: 'Science Processes in the Stages of Production of Kenkey' }
    ],
    'bio1_1': [
      { id: 'li_bio1_1_1', name: 'Importance of Biology' },
      { id: 'li_bio1_1_2', name: 'Branches of Biology' },
      { id: 'li_bio1_1_3', name: 'Fields of Work Related to Biology' },
      { id: 'li_bio1_1_4', name: 'The Scientific Method' },
      { id: 'li_bio1_1_5', name: 'Steps/Techniques Used in the Scientific Method' },
      { id: 'li_bio1_1_6', name: 'Symmetry, Orientation, and Sectioning' },
      { id: 'li_bio1_1_7', name: 'Types of Microscopes and Functions of the Light Microscope' },
      { id: 'li_bio1_1_8', name: 'Caring for a Light Microscope and Slides' }
    ],
    'bio2_1': [
      { id: 'li_bio2_1_1', name: 'Biological Practices and Tools Used in Fish Farming' },
      { id: 'li_bio2_1_2', name: 'Harvesting, Processing and Marketing Fish' },
      { id: 'li_bio2_1_3', name: 'Fish Stock Management and Conservation' }
    ],
    'bio3_1': [
      { id: 'li_bio3_1_1', name: 'Introduction to the Cell Membrane' },
      { id: 'li_bio3_1_2', name: 'Movement of Substances Through the Cell Membrane' }
    ],
    'bio4_1': [
      { id: 'li_bio4_1_1', name: 'Biological Keys: Making and Using Them' },
      { id: 'li_bio4_1_2', name: 'Classification of Lower Organisms' },
      { id: 'li_bio4_1_3', name: 'Major Taxa in Hierarchical Classification' },
      { id: 'li_bio4_1_4', name: 'Binomial Nomenclature' },
      { id: 'li_bio4_1_5', name: 'Life Processes and Economic Importance of Lower Organisms' }
    ],
    'bio5_1': [
      { id: 'li_bio5_1_1', name: 'Definition of Ecology and Related Terms' },
      { id: 'li_bio5_1_2', name: 'Ecological Concepts in Major Habitats' },
      { id: 'li_bio5_1_3', name: 'Interdependency of Living Organisms' },
      { id: 'li_bio5_1_4', name: 'Outcomes of Interdependency in the Environment' },
      { id: 'li_bio5_1_5', name: 'Ecological Tools for Estimating Population Size and Density' },
      { id: 'li_bio5_1_6', name: 'Energy Flow Determination Methods' },
      { id: 'li_bio5_1_7', name: 'Ecological Pyramids' },
      { id: 'li_bio5_1_8', name: 'Relevance of Energy Flow Determination Methods' }
    ],
    'bio6_1': [
      { id: 'li_bio6_1_1', name: 'Common Diseases: Causative Organisms' },
      { id: 'li_bio6_1_2', name: 'Common Diseases: Transmission Cycles' },
      { id: 'li_bio6_1_3', name: 'Common Diseases: Effects and Control/Prevention' }
    ],
    'bio7_1': [
      { id: 'li_bio7_1_1', name: 'External Organs/Features and Their Functions' },
      { id: 'li_bio7_1_2', name: 'Internal Organs/Features and Their Functions' },
      { id: 'li_bio7_1_3', name: 'Sensory Organs and Their Functions' },
      { id: 'li_bio7_1_4', name: 'Digestive Systems and Associated Organs in Different Animals' }
    ],
    'bio8_1': [
      { id: 'li_bio8_1_1', name: 'Morphology of Flowering Plants' },
      { id: 'li_bio8_1_2', name: 'Distinguishing Features of Angiosperms' },
      { id: 'li_bio8_1_3', name: 'Distinctions Between Monocotyledons and Dicotyledons' },
      { id: 'li_bio8_1_4', name: 'Internal Structures and Functions of Plant Parts' },
      { id: 'li_bio8_1_5', name: 'Factors Affecting Growth and Development in Flowering Plants' }
    ],
    'chem1_1': [
      { id: 'li_chem1_1_1', name: 'Introduction to Chemistry and Scientific Method' },
      { id: 'li_chem1_1_2', name: 'Concept of the Mole' },
      { id: 'li_chem1_1_3', name: 'Mole Ratios, Chemical Formulae and Equations' },
      { id: 'li_chem1_1_4', name: 'Kinetic Theory and States of Matter' }
    ],
    'chem1_2': [
      { id: 'li_chem1_2_1', name: 'Solubility and Qualitative Analysis' }
    ],
    'chem1_3': [
      { id: 'li_chem1_3_1', name: 'Periodic Properties' }
    ],
    'chem1_4': [
      { id: 'li_chem1_4_1', name: 'Interatomic Bonding' },
      { id: 'li_chem1_4_2', name: 'Intermolecular Bonding' }
    ],
    'chem2_1': [
      { id: 'li_chem2_1_1', name: 'Solubility and Qualitative Analysis' }
    ],
    'chem3_1': [
      { id: 'li_chem3_1_1', name: 'Periodic Properties' }
    ],
    'chem4_1': [
      { id: 'li_chem4_1_1', name: 'Interatomic Bonding' },
      { id: 'li_chem4_1_2', name: 'Intermolecular Bonding' }
    ],
    'chem4_2': [
      { id: 'li_chem4_2_1', name: 'Intermolecular Bonding' }
    ],
    'chem5_1': [
      { id: 'li_chem5_1_1', name: 'Qualitative and Quantitative Analysis of Organic Compounds' }
    ],
    'chem6_1': [
      { id: 'li_chem6_1_1', name: 'Classifications of Organic Compounds' }
    ]
  };

  const getFilteredClassGrades = () => {
    if (!data.classLevel) return [];
    return classGrades[data.classLevel as keyof typeof classGrades] || [];
  };

  const getFilteredSubjects = () => {
    if (!data.classLevel) return [];
    return subjects[data.classLevel as keyof typeof subjects] || [];
  };

  const getFilteredStrands = () => {
    if (!data.subjectId) return [];
    return strands[data.subjectId as keyof typeof strands] || [];
  };

  const getFilteredSubStrands = () => {
    if (!data.strandId) return [];
    return subStrands[data.strandId as keyof typeof subStrands] || [];
  };

  const getFilteredLearningIndicators = () => {
    if (!data.subStrandId) return [];
    return learningIndicators[data.subStrandId as keyof typeof learningIndicators] || [];
  };

  // Get available teacher manuals for the selected class, subject and strand
  const getAvailableTeacherManuals = (data: FormData) => {
    // For physics subject, filter by strand
    if (data.subjectId === 'phy_shs' && data.strandId) {
      // Sections 1-4 are in Book 1
      if (['phy1', 'phy2', 'phy3', 'phy4'].includes(data.strandId)) {
        return teacherManuals.filter(
          manual => manual.subjectId === 'phy_shs' && manual.id === 'tm7'
        );
      } 
      // Sections 5-8 are in Book 2
      else if (['phy5', 'phy6', 'phy7', 'phy8'].includes(data.strandId)) {
        return teacherManuals.filter(
          manual => manual.subjectId === 'phy_shs' && manual.id === 'tm8'
        );
      }
    }
    
    // For computing subject, filter by strand
    if (data.subjectId === 'comp_shs' && data.strandId) {
      // Computer Architecture (Section 1) is in Book 1
      if (['comp1'].includes(data.strandId)) {
        return teacherManuals.filter(
          manual => manual.subjectId === 'comp_shs' && manual.id === 'tm4'
        );
      } 
      // Programming and Web Dev (Sections 2-3) are in Book 2
      else if (['comp2', 'comp3'].includes(data.strandId)) {
        return teacherManuals.filter(
          manual => manual.subjectId === 'comp_shs' && manual.id === 'tm5'
        );
      }
    }
    
    // For biology subject, filter by strand
    if (data.subjectId === 'bio_shs' && data.strandId) {
      // Special case for section 5 (Ecology) which is split between books
      if (data.strandId === 'bio5' && data.subStrandId === 'bio5_1' && 
          data.learningIndicators.includes('Relevance of Energy Flow Determination Methods')) {
        return teacherManuals.filter(
          manual => manual.subjectId === 'bio_shs' && manual.id === 'tm10'
        );
      }
      // Sections 1-5 are in Book 1 (excluding special case above)
      else if (['bio1', 'bio2', 'bio3', 'bio4', 'bio5'].includes(data.strandId)) {
        return teacherManuals.filter(
          manual => manual.subjectId === 'bio_shs' && manual.id === 'tm9'
        );
      } 
      // Sections 6-8 are in Book 2
      else if (['bio6', 'bio7', 'bio8'].includes(data.strandId)) {
        return teacherManuals.filter(
          manual => manual.subjectId === 'bio_shs' && manual.id === 'tm10'
        );
      }
    }
    
    // For chemistry subject - all sections are in one combined book
    if (data.subjectId === 'chem_shs') {
      return teacherManuals.filter(
        manual => manual.subjectId === 'chem_shs' && manual.id === 'tm13'
      );
    }
    
    // For general science subject, filter by strand
    if (data.subjectId === 'sci_shs' && data.strandId) {
      // Sections 1-4 are in Book 1
      if (['sci1', 'sci2', 'sci3', 'sci4'].includes(data.strandId)) {
        return teacherManuals.filter(
          manual => manual.subjectId === 'sci_shs' && manual.id === 'tm11'
        );
      } 
      // Sections 5-9 are in Book 2
      else if (['sci5', 'sci6', 'sci7', 'sci8', 'sci9'].includes(data.strandId)) {
        return teacherManuals.filter(
          manual => manual.subjectId === 'sci_shs' && manual.id === 'tm12'
        );
      }
    }
    
    // Return all manuals that match the subject
    return teacherManuals.filter(manual => manual.subjectId === data.subjectId);
  };

  const handleLearningIndicatorChange = (id: string, checked: boolean) => {
    if (checked) {
      onUpdate({ 
        learningIndicators: [...data.learningIndicators, id] 
      });
    } else {
      onUpdate({ 
        learningIndicators: data.learningIndicators.filter(item => item !== id) 
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // In a real app, you would upload the file and get a document ID
      // For now, we'll just use a mock ID
      onUpdate({ documentId: 'uploaded_' + Math.random().toString(36).substring(2, 9) });
    }
  };

  const availableManuals = getAvailableTeacherManuals(data);

  const getSubStrands = (subjectId: string, strandId: string) => {
    // Sub-strands for each strand
    const subStrandMap: Record<string, Array<{ id: string, name: string }>> = {
      // ... existing code ...

      // Biology sub-strands
      'bio1': [
        { id: 'bio1_1', name: 'Foundations of Biology' }
      ],
      'bio2': [
        { id: 'bio2_1', name: 'Biology and Entrepreneurship' }
      ],
      'bio3': [
        { id: 'bio3_1', name: 'Cell Structure and Function' }
      ],
      'bio4': [
        { id: 'bio4_1', name: 'Ecology' }
      ],
      'bio5': [
        { id: 'bio5_1', name: 'Ecology' }
      ],
      'bio6': [
        { id: 'bio6_1', name: 'Diseases and Infections' }
      ],
      'bio7': [
        { id: 'bio7_1', name: 'Mammalian Systems' }
      ],
      'bio8': [
        { id: 'bio8_1', name: 'Plant Systems' }
      ],
      
      // Chemistry sub-strands
      'chem1': [
        { id: 'chem1_1', name: 'Introduction to Chemistry and Scientific Method' },
        { id: 'chem1_2', name: 'Concept of the Mole' },
        { id: 'chem1_3', name: 'Mole Ratios, Chemical Formulae and Equations' },
        { id: 'chem1_4', name: 'Kinetic Theory and States of Matter' }
      ],
      'chem2': [
        { id: 'chem2_1', name: 'Solubility and Qualitative Analysis' }
      ],
      'chem3': [
        { id: 'chem3_1', name: 'Periodic Properties' }
      ],
      'chem4': [
        { id: 'chem4_1', name: 'Interatomic Bonding' },
        { id: 'chem4_2', name: 'Intermolecular Bonding' }
      ],
      'chem5': [
        { id: 'chem5_1', name: 'Qualitative and Quantitative Analysis of Organic Compounds' }
      ],
      'chem6': [
        { id: 'chem6_1', name: 'Classifications of Organic Compounds' }
      ],
      
      // ... existing code ...
    };
    
    return subStrandMap[strandId] || [];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Document & Curriculum</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Class Level Selection */}
        <div className="space-y-3">
          <Label>Class Level</Label>
          <RadioGroup
            value={data.classLevel}
            onValueChange={(value) => onUpdate({ 
              classLevel: value as 'JHS' | 'SHS',
              classGrade: '', // Reset dependent fields
              subjectId: '',
              strandId: '',
              subStrandId: '',
              documentId: '', // Reset document selection
              learningIndicators: []
            })}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2 opacity-50">
              <RadioGroupItem value="JHS" id="jhs" disabled />
              <Label htmlFor="jhs" className="text-gray-500">JHS (Junior High School) - Coming Soon</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="SHS" id="shs" />
              <Label htmlFor="shs">SHS (Senior High School)</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Class Grade Selection */}
        <div className="space-y-2">
          <Label htmlFor="classGrade">Class</Label>
          <Select
            value={data.classGrade}
            onValueChange={(value) => onUpdate({ 
              classGrade: value,
              subjectId: '', // Reset dependent fields
              strandId: '',
              subStrandId: '',
              documentId: '', // Reset document selection
              learningIndicators: []
            })}
            disabled={!data.classLevel}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                !data.classLevel ? "Select class level first" : "Select a class"
              } />
            </SelectTrigger>
            <SelectContent>
              {getFilteredClassGrades().map((grade) => (
                <SelectItem key={grade.id} value={grade.id}>
                  {grade.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subject Selection */}
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Select
            value={data.subjectId}
            onValueChange={(value) => onUpdate({ 
              subjectId: value,
              strandId: '', // Reset dependent fields
              subStrandId: '',
              documentId: '', // Reset document selection when subject changes
              learningIndicators: []
            })}
            disabled={!data.classGrade}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                !data.classGrade ? "Select class first" : "Select a subject"
              } />
            </SelectTrigger>
            <SelectContent>
              {getFilteredSubjects().map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Strand Selection */}
        <div className="space-y-2">
          <Label htmlFor="strand">Strand</Label>
          <Select
            value={data.strandId}
            onValueChange={(value) => onUpdate({ 
              strandId: value,
              subStrandId: '', // Reset dependent field
              learningIndicators: []
            })}
            disabled={!data.subjectId}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                !data.subjectId ? "Select subject first" : "Select a strand"
              } />
            </SelectTrigger>
            <SelectContent>
              {getFilteredStrands().map((strand) => (
                <SelectItem key={strand.id} value={strand.id}>
                  {strand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sub-Strand Selection */}
        <div className="space-y-2">
          <Label htmlFor="subStrand">Sub-Strand</Label>
          <Select
            value={data.subStrandId}
            onValueChange={(value) => onUpdate({ 
              subStrandId: value,
              learningIndicators: [] // Reset learning indicators when sub-strand changes
            })}
            disabled={!data.strandId}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                !data.strandId ? "Select strand first" : "Select a sub-strand"
              } />
            </SelectTrigger>
            <SelectContent>
              {getFilteredSubStrands().map((subStrand) => (
                <SelectItem key={subStrand.id} value={subStrand.id}>
                  {subStrand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Learning Indicators Selection */}
        {data.subStrandId && (
          <div className="space-y-2">
            <Label>Learning Indicators (Select at least one)</Label>
            <div className="border rounded-md p-3 max-h-60 overflow-y-auto space-y-2">
              {getFilteredLearningIndicators().length > 0 ? (
                getFilteredLearningIndicators().map((indicator) => (
                  <div key={indicator.id} className="flex items-start space-x-2">
                    <Checkbox 
                      id={indicator.id} 
                      checked={data.learningIndicators.includes(indicator.id)}
                      onCheckedChange={(checked) => 
                        handleLearningIndicatorChange(indicator.id, checked === true)
                      }
                    />
                    <Label 
                      htmlFor={indicator.id} 
                      className="text-sm leading-tight"
                    >
                      {indicator.name}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No learning indicators available for this sub-strand.
                </p>
              )}
            </div>
            {data.subStrandId && data.learningIndicators.length === 0 && (
              <p className="text-sm text-red-500">
                Please select at least one learning indicator.
              </p>
            )}
          </div>
        )}
        
        {/* Document Selection - Moved to bottom */}
        <div className="space-y-2 mt-4">
          <Label htmlFor="document" className="flex items-center">
            Teacher Manual <span className="text-red-500 ml-1">*</span>
          </Label>
          {data.classGrade && data.subjectId ? (
            availableManuals.length > 0 ? (
              <>
                <Select
                  value={data.documentId}
                  onValueChange={(value) => onUpdate({ documentId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a teacher manual" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableManuals.map((manual) => (
                      <SelectItem key={manual.id} value={manual.id}>
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          {manual.fileName}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!data.documentId && (
                  <p className="text-sm text-red-500 mt-1">
                    A teacher manual is required to generate questions.
                  </p>
                )}
              </>
            ) : (
              <div className="space-y-2">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No teacher manuals found for this class and subject. Please contact an administrator.
                  </AlertDescription>
                </Alert>
              </div>
            )
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Please select a class and subject to see available teacher manuals.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GenerateStep1New; 