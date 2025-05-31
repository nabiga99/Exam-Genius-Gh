
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, AlertCircle } from 'lucide-react';
import { GenerateFormData } from '../GenerateWizard';

interface GenerateStep1Props {
  data: GenerateFormData;
  onUpdate: (updates: Partial<GenerateFormData>) => void;
}

const GenerateStep1: React.FC<GenerateStep1Props> = ({ data, onUpdate }) => {
  // Mock data - in real app, these would come from API
  const documents = [
    { id: '1', fileName: 'JHS Science Syllabus 2024.pdf' },
    { id: '2', fileName: 'Biology Teaching Notes.docx' },
    { id: '3', fileName: 'Mathematics Curriculum Guide.pdf' }
  ];

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
      { id: 'math_shs', name: 'Mathematics' }
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
    ]
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Document & Curriculum</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Document Selection */}
        <div className="space-y-2">
          <Label htmlFor="document">Choose a Document</Label>
          {documents.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No documents available. 
                <a href="/documents" className="text-green-600 hover:underline ml-1">
                  Upload one first
                </a>
              </AlertDescription>
            </Alert>
          ) : (
            <Select
              value={data.documentId}
              onValueChange={(value) => onUpdate({ documentId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a document" />
              </SelectTrigger>
              <SelectContent>
                {documents.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id}>
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      {doc.fileName}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Class Level Selection */}
        <div className="space-y-3">
          <Label>Class Level</Label>
          <RadioGroup
            value={data.classLevel}
            onValueChange={(value) => onUpdate({ 
              classLevel: value as 'JHS' | 'SHS',
              subjectId: '', // Reset dependent fields
              strandId: '',
              subStrandId: ''
            })}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="JHS" id="jhs" />
              <Label htmlFor="jhs">JHS (Junior High School)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="SHS" id="shs" />
              <Label htmlFor="shs">SHS (Senior High School)</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Subject Selection */}
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Select
            value={data.subjectId}
            onValueChange={(value) => onUpdate({ 
              subjectId: value,
              strandId: '', // Reset dependent fields
              subStrandId: ''
            })}
            disabled={!data.classLevel}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                !data.classLevel ? "Select class level first" : "Select a subject"
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
              subStrandId: '' // Reset dependent field
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
            onValueChange={(value) => onUpdate({ subStrandId: value })}
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
      </CardContent>
    </Card>
  );
};

export default GenerateStep1;
