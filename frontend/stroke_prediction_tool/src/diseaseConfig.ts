export type FieldType = 'number' | 'select' | 'text' | 'textarea'

export type FieldOption = {
  label: string
  value: string
}

export type DiseaseField = {
  key: string
  label: string
  type: FieldType
  section?: string
  placeholder?: string
  step?: string
  required?: boolean
  options?: FieldOption[]
}

export type DashboardMetric = {
  label: string
  key: string
  baseline: number
  unit?: string
}

export type DiseaseDefinition = {
  slug: string
  title: string
  shortDescription: string
  intro: string
  endpointReady: boolean
  badge: string
  fields: DiseaseField[]
  metrics: DashboardMetric[]
  recommendations: string[]
}

const yesNoNumericOptions: FieldOption[] = [
  { label: 'No', value: '0' },
  { label: 'Yes', value: '1' },
]

const yesNoTextOptions: FieldOption[] = [
  { label: 'No', value: 'no' },
  { label: 'Yes', value: 'yes' },
]

export const sharedReportFields: DiseaseField[] = [
  {
    key: 'full_name',
    label: 'Full Name',
    type: 'text',
    section: 'Patient Information',
    placeholder: 'e.g. Rahul Sharma',
    required: true,
  },
  {
    key: 'patient_id',
    label: 'Patient ID',
    type: 'text',
    section: 'Patient Information',
    placeholder: 'e.g. NG-2026-001',
  },
  {
    key: 'email',
    label: 'Email Address',
    type: 'text',
    section: 'Patient Information',
    placeholder: 'e.g. patient@example.com',
  },
  {
    key: 'phone_number',
    label: 'Phone Number',
    type: 'text',
    section: 'Patient Information',
    placeholder: 'e.g. +91 9876543210',
  },
  {
    key: 'height_cm',
    label: 'Height (cm)',
    type: 'number',
    section: 'Patient Information',
    placeholder: 'e.g. 170',
    step: '0.1',
  },
  {
    key: 'weight_kg',
    label: 'Weight (kg)',
    type: 'number',
    section: 'Patient Information',
    placeholder: 'e.g. 68',
    step: '0.1',
  },
  {
    key: 'physical_activity_level',
    label: 'Physical Activity Level',
    type: 'select',
    section: 'Lifestyle and History',
    options: [
      { label: 'Low', value: 'Low' },
      { label: 'Moderate', value: 'Moderate' },
      { label: 'High', value: 'High' },
    ],
  },
  {
    key: 'alcohol_use',
    label: 'Alcohol Use',
    type: 'select',
    section: 'Lifestyle and History',
    options: [
      { label: 'None', value: 'None' },
      { label: 'Occasional', value: 'Occasional' },
      { label: 'Regular', value: 'Regular' },
    ],
  },
  {
    key: 'sleep_hours',
    label: 'Average Sleep (hours)',
    type: 'number',
    section: 'Lifestyle and History',
    placeholder: 'e.g. 7',
    step: '0.5',
  },
  {
    key: 'family_history',
    label: 'Family History',
    type: 'text',
    section: 'Lifestyle and History',
    placeholder: 'e.g. Diabetes in father, hypertension in mother',
  },
  {
    key: 'current_medications',
    label: 'Current Medications',
    type: 'textarea',
    section: 'Lifestyle and History',
    placeholder: 'List current medications, supplements, or ongoing treatment',
  },
  {
    key: 'primary_concerns',
    label: 'Primary Concerns or Symptoms',
    type: 'textarea',
    section: 'Lifestyle and History',
    placeholder: 'Describe current symptoms, concerns, or recent findings',
  },
]

function withAssessmentSection(fields: DiseaseField[]): DiseaseField[] {
  return fields.map((field) => ({
    ...field,
    section: field.section ?? 'Assessment Inputs',
  }))
}

export function getAllFieldsForDisease(slug: string): DiseaseField[] {
  const definition = diseaseDefinitionMap[slug]
  if (!definition) {
    return sharedReportFields
  }

  return [...sharedReportFields, ...withAssessmentSection(definition.fields)]
}

export const diseaseDefinitions: DiseaseDefinition[] = [
  {
    slug: 'stroke',
    title: 'Stroke Risk',
    shortDescription:
      'Assesses stroke-related risk using demographic, metabolic, and cardiovascular indicators.',
    intro:
      'This assessment reviews clinically relevant inputs associated with stroke risk and provides a structured probability estimate.',
    endpointReady: true,
    badge: 'Model Ready',
    fields: [
      {
        key: 'gender',
        label: 'Gender',
        type: 'select',
        options: [
          { label: 'Female', value: 'Female' },
          { label: 'Male', value: 'Male' },
          { label: 'Other', value: 'Other' },
          { label: 'Unknown', value: 'Unknown' },
        ],
      },
      { key: 'age', label: 'Age', type: 'number', placeholder: 'e.g. 45', required: true, step: '1' },
      {
        key: 'hypertension',
        label: 'Hypertension',
        type: 'select',
        options: yesNoNumericOptions,
      },
      {
        key: 'heart_disease',
        label: 'Heart Disease History',
        type: 'select',
        options: yesNoNumericOptions,
      },
      {
        key: 'ever_married',
        label: 'Ever Married',
        type: 'select',
        options: [
          { label: 'Yes', value: 'Yes' },
          { label: 'No', value: 'No' },
        ],
      },
      {
        key: 'work_type',
        label: 'Work Type',
        type: 'select',
        options: [
          { label: 'Private', value: 'Private' },
          { label: 'Self-employed', value: 'Self-employed' },
          { label: 'Government Job', value: 'Govt_job' },
          { label: 'Children', value: 'children' },
          { label: 'Never Worked', value: 'Never_worked' },
        ],
      },
      {
        key: 'Residence_type',
        label: 'Residence Type',
        type: 'select',
        options: [
          { label: 'Urban', value: 'Urban' },
          { label: 'Rural', value: 'Rural' },
        ],
      },
      {
        key: 'avg_glucose_level',
        label: 'Average Glucose Level',
        type: 'number',
        placeholder: 'e.g. 140',
        required: true,
        step: '0.01',
      },
      {
        key: 'bmi',
        label: 'BMI',
        type: 'number',
        placeholder: 'e.g. 26.5',
        required: true,
        step: '0.1',
      },
      {
        key: 'smoking_status',
        label: 'Smoking Status',
        type: 'select',
        options: [
          { label: 'Never Smoked', value: 'never smoked' },
          { label: 'Formerly Smoked', value: 'formerly smoked' },
          { label: 'Smokes', value: 'smokes' },
          { label: 'Unknown', value: 'Unknown' },
        ],
      },
    ],
    metrics: [
      { label: 'Age', key: 'age', baseline: 40 },
      { label: 'Glucose', key: 'avg_glucose_level', baseline: 100, unit: 'mg/dL' },
      { label: 'BMI', key: 'bmi', baseline: 25 },
    ],
    recommendations: [
      'Review blood pressure, glucose levels, and cardiovascular history with a qualified clinician.',
      'Maintain a consistent routine for physical activity, sleep, hydration, and smoking reduction.',
      'Interpret individual readings together with longer-term health trends and follow-up evaluation.',
    ],
  },
  {
    slug: 'diabetes',
    title: 'Diabetes Risk',
    shortDescription:
      'Evaluates diabetes-related risk using glycemic markers, BMI, and metabolic health indicators.',
    intro:
      'This assessment estimates diabetes risk through a focused review of blood glucose, HbA1c, and related metabolic factors.',
    endpointReady: true,
    badge: 'Model Ready',
    fields: [
      {
        key: 'gender',
        label: 'Gender',
        type: 'select',
        options: [
          { label: 'Female', value: 'Female' },
          { label: 'Male', value: 'Male' },
          { label: 'Other', value: 'Other' },
          { label: 'Unknown', value: 'Unknown' },
        ],
      },
      { key: 'age', label: 'Age', type: 'number', placeholder: 'e.g. 45', required: true, step: '1' },
      {
        key: 'hypertension',
        label: 'Hypertension',
        type: 'select',
        options: yesNoNumericOptions,
      },
      {
        key: 'heart_disease',
        label: 'Heart Disease History',
        type: 'select',
        options: yesNoNumericOptions,
      },
      {
        key: 'smoking_history',
        label: 'Smoking History',
        type: 'select',
        options: [
          { label: 'Never', value: 'never' },
          { label: 'Former', value: 'former' },
          { label: 'Current', value: 'current' },
          { label: 'Ever', value: 'ever' },
          { label: 'Not Current', value: 'not current' },
          { label: 'No Info', value: 'No Info' },
        ],
      },
      {
        key: 'bmi',
        label: 'BMI',
        type: 'number',
        placeholder: 'e.g. 28.4',
        required: true,
        step: '0.1',
      },
      {
        key: 'HbA1c_level',
        label: 'HbA1c Level',
        type: 'number',
        placeholder: 'e.g. 6.5',
        required: true,
        step: '0.1',
      },
      {
        key: 'blood_glucose_level',
        label: 'Blood Glucose Level',
        type: 'number',
        placeholder: 'e.g. 145',
        required: true,
        step: '1',
      },
    ],
    metrics: [
      { label: 'Age', key: 'age', baseline: 40 },
      { label: 'Blood Glucose', key: 'blood_glucose_level', baseline: 100, unit: 'mg/dL' },
      { label: 'HbA1c', key: 'HbA1c_level', baseline: 5.7, unit: '%' },
      { label: 'BMI', key: 'bmi', baseline: 25 },
    ],
    recommendations: [
      'Discuss elevated HbA1c or glucose values with a healthcare professional.',
      'Monitor nutrition, weight patterns, and regular physical activity as part of risk management.',
      'Use follow-up laboratory testing to confirm whether the observed pattern is persistent.',
    ],
  },
  {
    slug: 'kidney',
    title: 'Kidney Disease Risk',
    shortDescription:
      'Reviews renal function, blood pressure, anemia, and urine findings associated with kidney disease risk.',
    intro:
      'This assessment estimates chronic kidney disease risk using key renal biomarkers and supporting clinical indicators.',
    endpointReady: true,
    badge: 'Model Ready',
    fields: [
      { key: 'Age of the patient', label: 'Age', type: 'number', placeholder: 'e.g. 54', required: true, step: '1' },
      { key: 'Blood pressure (mm/Hg)', label: 'Blood Pressure', type: 'number', placeholder: 'e.g. 130', required: true, step: '1' },
      { key: 'Specific gravity of urine', label: 'Urine Specific Gravity', type: 'number', placeholder: 'e.g. 1.02', required: true, step: '0.001' },
      { key: 'Albumin in urine', label: 'Urine Albumin', type: 'number', placeholder: 'e.g. 1', required: true, step: '1' },
      { key: 'Sugar in urine', label: 'Urine Sugar', type: 'number', placeholder: 'e.g. 0', required: true, step: '1' },
      { key: 'Random blood glucose level (mg/dl)', label: 'Random Blood Glucose', type: 'number', placeholder: 'e.g. 120', required: true, step: '0.01' },
      { key: 'Blood urea (mg/dl)', label: 'Blood Urea', type: 'number', placeholder: 'e.g. 35', required: true, step: '0.01' },
      { key: 'Serum creatinine (mg/dl)', label: 'Serum Creatinine', type: 'number', placeholder: 'e.g. 1.2', required: true, step: '0.01' },
      { key: 'Sodium level (mEq/L)', label: 'Sodium Level', type: 'number', placeholder: 'e.g. 138', required: true, step: '0.01' },
      { key: 'Potassium level (mEq/L)', label: 'Potassium Level', type: 'number', placeholder: 'e.g. 4.5', required: true, step: '0.01' },
      { key: 'Hemoglobin level (gms)', label: 'Hemoglobin', type: 'number', placeholder: 'e.g. 13.5', required: true, step: '0.1' },
      { key: 'Hypertension (yes/no)', label: 'Hypertension', type: 'select', options: yesNoTextOptions },
      { key: 'Diabetes mellitus (yes/no)', label: 'Diabetes Mellitus', type: 'select', options: yesNoTextOptions },
      {
        key: 'Appetite (good/poor)',
        label: 'Appetite',
        type: 'select',
        options: [
          { label: 'Good', value: 'good' },
          { label: 'Poor', value: 'poor' },
        ],
      },
      { key: 'Pedal edema (yes/no)', label: 'Pedal Edema', type: 'select', options: yesNoTextOptions },
      { key: 'Anemia (yes/no)', label: 'Anemia', type: 'select', options: yesNoTextOptions },
      { key: 'Estimated Glomerular Filtration Rate (eGFR)', label: 'eGFR', type: 'number', placeholder: 'e.g. 90', required: true, step: '0.01' },
      { key: 'Smoking status', label: 'Smoking Status', type: 'select', options: yesNoTextOptions },
      { key: 'Body Mass Index (BMI)', label: 'BMI', type: 'number', placeholder: 'e.g. 24.0', required: true, step: '0.1' },
    ],
    metrics: [
      { label: 'Creatinine', key: 'Serum creatinine (mg/dl)', baseline: 1.0, unit: 'mg/dL' },
      { label: 'eGFR', key: 'Estimated Glomerular Filtration Rate (eGFR)', baseline: 90, unit: 'mL/min' },
      { label: 'Blood Pressure', key: 'Blood pressure (mm/Hg)', baseline: 120, unit: 'mm/Hg' },
      { label: 'Hemoglobin', key: 'Hemoglobin level (gms)', baseline: 13.5, unit: 'g/dL' },
    ],
    recommendations: [
      'Review creatinine, eGFR, and blood pressure results with a clinician familiar with renal care.',
      'Monitor hydration, medication exposure, and follow-up renal function testing where appropriate.',
      'Base clinical decisions on repeated laboratory review rather than a single data point alone.',
    ],
  },
  {
    slug: 'heart',
    title: 'Heart Disease Risk',
    shortDescription:
      'Planned for a future release and reserved for the next production-ready model.',
    intro:
      'This workflow will be activated once the required heart disease dataset and validated model artifact are available.',
    endpointReady: false,
    badge: 'Coming Soon',
    fields: [],
    metrics: [],
    recommendations: [],
  },
]

export const diseaseDefinitionMap = Object.fromEntries(
  diseaseDefinitions.map((definition) => [definition.slug, definition]),
) as Record<string, DiseaseDefinition>

export function createInitialFormState(slug: string): Record<string, string> {
  return Object.fromEntries(
    getAllFieldsForDisease(slug).map((field) => {
      if (field.type === 'select') {
        return [field.key, field.options?.[0]?.value ?? '']
      }

      return [field.key, '']
    }),
  )
}
