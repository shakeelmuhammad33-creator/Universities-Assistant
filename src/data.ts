import { University, Program } from './types';

export const INITIAL_UNIVERSITIES: University[] = [
  {
    id: 'aiou',
    name: 'Allama Iqbal Open University',
    nameUrdu: 'علامہ اقبال اوپن یونیورسٹی',
    location: 'Islamabad',
    locationUrdu: 'اسلام آباد',
    description: 'Distance learning university offering diverse programs.'
  },
  {
    id: 'iiui',
    name: 'International Islamic University Islamabad',
    nameUrdu: 'انٹرنیشنل اسلامک یونیورسٹی اسلام آباد',
    location: 'Islamabad',
    locationUrdu: 'اسلام آباد',
    description: 'A prestigious institution blending modern and Islamic education.'
  },
  {
    id: 'riphah',
    name: 'Riphah International University',
    nameUrdu: 'رفاہ انٹرنیشنل یونیورسٹی',
    location: 'Islamabad/Faisalabad',
    locationUrdu: 'اسلام آباد اور فیصل آباد',
    description: 'Comprehensive university with international standards.'
  },
  {
    id: 'numl',
    name: 'NUML University',
    nameUrdu: 'نمل یونیورسٹی',
    location: 'Islamabad',
    locationUrdu: 'اسلام آباد',
    description: 'Specializing in languages and modern sciences.'
  },
  {
    id: 'al-hamd',
    name: 'Al-Hamd Islamic University',
    nameUrdu: 'الحمد اسلامک یونیورسٹی',
    location: 'Islamabad',
    locationUrdu: 'اسلام آباد',
    description: 'Focusing on Islamic studies and ethics.'
  },
  {
    id: 'awkum',
    name: 'Abdul Wali Khan University',
    nameUrdu: 'عبدالولی خان یونیورسٹی',
    location: 'Mardan',
    locationUrdu: 'مردان',
    description: 'A leading public sector university in KPK.'
  },
  {
    id: 'qurtaba',
    name: 'Qurtaba University',
    nameUrdu: 'قرطبہ یونیورسٹی',
    location: 'Peshawar/DI Khan',
    locationUrdu: 'پشاور اور ڈی آئی خان',
    description: 'Dedicated to academic excellence.'
  },
  {
    id: 'iub',
    name: 'Islamia University Bahawalpur',
    nameUrdu: 'اسلامیہ یونیورسٹی بہاولپور',
    location: 'Bahawalpur/Bahawalnagar/RYK',
    locationUrdu: 'بہاولپور، بہاولنگر، رحیم یار خان',
    description: 'Historical university serving Southern Punjab.'
  },
  {
    id: 'punjab-uni',
    name: 'University of the Punjab',
    nameUrdu: 'یونیورسٹی آف پنجاب',
    location: 'Lahore',
    locationUrdu: 'لاہور',
    description: 'Oldest and largest public university in Pakistan.'
  },
  {
    id: 'uol',
    name: 'University of Lahore',
    nameUrdu: 'یونیورسٹی آف لاہور',
    location: 'Lahore',
    locationUrdu: 'لاہور',
    description: 'Leading private sector university.'
  },
  {
    id: 'uop',
    name: 'University of Peshawar',
    nameUrdu: 'یونیورسٹی آف پشاور',
    location: 'Peshawar',
    locationUrdu: 'پشاور',
    description: 'Oldest university in Peshawar.'
  }
];

export const INITIAL_PROGRAMS: Program[] = [
  {
    id: 'iiui-bs-islamic-studies',
    universityId: 'iiui',
    name: 'Islamic Studies',
    level: 'BS',
    feePerSemester: 55000,
    eligibilityCriteria: 'انٹرمیڈیٹ یا مساوی (کم از کم 50 فیصد نمبروں کے ساتھ)',
    minPercentage: 50,
    classMode: 'Regular',
    classSchedule: 'Weekdays',
    description: 'اسلامی اصولوں کا جامع مطالعہ۔'
  },
  {
    id: 'iiui-bs-usuluddin',
    universityId: 'iiui',
    name: 'Usuluddin',
    level: 'BS',
    feePerSemester: 58000,
    eligibilityCriteria: 'انٹرمیڈیٹ یا مساوی (کم از کم 55 فیصد نمبروں کے ساتھ)',
    minPercentage: 55,
    classMode: 'Regular',
    classSchedule: 'Weekdays',
    description: 'اصول الدین کا خصوصی مطالعہ۔'
  },
  {
    id: 'aiou-bs-islamic-studies',
    universityId: 'aiou',
    name: 'Islamic Studies',
    level: 'BS',
    feePerSemester: 15000,
    eligibilityCriteria: 'انٹرمیڈیٹ یا مساوی (کم از کم 45 فیصد نمبروں کے ساتھ)',
    minPercentage: 45,
    classMode: 'Online',
    classSchedule: 'DistanceLearning',
    description: 'آن لائن اور فاصلاتی تعلیم پر مبنی پروگرام۔'
  },
  {
    id: 'uol-ms-islamic-banking',
    universityId: 'uol',
    name: 'Islamic Banking & Finance',
    level: 'MS',
    feePerSemester: 85000,
    eligibilityCriteria: '16 سالہ تعلیم (کم از کم 60 فیصد یا 2.5 سی جی پی اے کے ساتھ)',
    minPercentage: 60,
    classMode: 'Regular',
    classSchedule: 'Weekend',
    description: 'اسلامی بینکاری اور مالیاتی نظام کا جدید مطالعہ۔'
  }
];
