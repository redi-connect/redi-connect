import { registerEnumType } from '@nestjs/graphql'

export enum RediCourse {
  BERLIN_DATA_CIRCLE = 'BERLIN_DATA_CIRCLE',
  BERLIN_INTRO_TO_JAVA = 'BERLIN_INTRO_TO_JAVA',
  BERLIN_JAVA_CIRCLE = 'BERLIN_JAVA_CIRCLE',
  BERLIN_PYTHON_FOUNDATION = 'BERLIN_PYTHON_FOUNDATION',
  BERLIN_DATA_ANALYTICS = 'BERLIN_DATA_ANALYTICS',
  BERLIN_SALESFORCE_FUNDAMENTALS = 'BERLIN_SALESFORCE_FUNDAMENTALS',
  BERLIN_INTRO_TO_COMPUTER_SCIENCE = 'BERLIN_INTRO_TO_COMPUTER_SCIENCE',
  BERLIN_HTML_CSS = 'BERLIN_HTML_CSS',
  BERLIN_JAVASCRIPT = 'BERLIN_JAVASCRIPT',
  BERLIN_REACT = 'BERLIN_REACT',
  BERLIN_DIGITAL_LITERACY_PROGRAM = 'BERLIN_DIGITAL_LITERACY_PROGRAM',
  BERLIN_CODING_FUNDAMENTALS = 'BERLIN_CODING_FUNDAMENTALS',
  BERLIN_UX_UI_DESIGN_BASICS = 'BERLIN_UX_UI_DESIGN_BASICS',
  BERLIN_UX_UI_DESIGN_INTERMEDIATE = 'BERLIN_UX_UI_DESIGN_INTERMEDIATE',
  BERLIN_ALUMNI = 'BERLIN_ALUMNI',
  NRW_HTML_AND_CSS = 'NRW_HTML_AND_CSS',
  NRW_JAVASCRIPT = 'NRW_JAVASCRIPT',
  NRW_REACT = 'NRW_REACT',
  NRW_INTRODUCTION_TO_PYTHON = 'NRW_INTRODUCTION_TO_PYTHON',
  NRW_DATA_ANALYTICS = 'NRW_DATA_ANALYTICS',
  NRW_MACHINE_LEARNING = 'NRW_MACHINE_LEARNING',
  NRW_UX_UI_DESIGN_BASICS = 'NRW_UX_UI_DESIGN_BASICS',
  NRW_UX_UI_DESIGN_INTERMEDIATE = 'NRW_UX_UI_DESIGN_INTERMEDIATE',
  NRW_INFRASTRUCTURE_BASICS = 'NRW_INFRASTRUCTURE_BASICS',
  NRW_CLOUD_COMPUTING = 'NRW_CLOUD_COMPUTING',
  NRW_INTERNET_OF_THINGS = 'NRW_INTERNET_OF_THINGS',
  NRW_ALUMNI = 'NRW_ALUMNI',
  MUNICH_INTRODUCTION_TO_COMPUTER_SCIENCE_ONLINE = 'MUNICH_INTRODUCTION_TO_COMPUTER_SCIENCE_ONLINE',
  MUNICH_INTRODUCTION_TO_COMPUTER_SCIENCE_HYBRID = 'MUNICH_INTRODUCTION_TO_COMPUTER_SCIENCE_HYBRID',
  MUNICH_INTRODUCTION_TO_COMPUTER_SCIENCE_UKR = 'MUNICH_INTRODUCTION_TO_COMPUTER_SCIENCE_UKR',
  MUNICH_PYTHON_INTERMEDIATE_ONLINE = 'MUNICH_PYTHON_INTERMEDIATE_ONLINE',
  MUNICH_PYTHON_INTERMEDIATE_HYBRID = 'MUNICH_PYTHON_INTERMEDIATE_HYBRID',
  MUNICH_PYTHON_INTERMEDIATE_UKR = 'MUNICH_PYTHON_INTERMEDIATE_UKR',
  MUNICH_FRONT_END_DEVELOPMENT_HTML_CSS = 'MUNICH_FRONT_END_DEVELOPMENT_HTML_CSS',
  MUNICH_FRONT_END_DEVELOPMENT_JAVASCRIPT = 'MUNICH_FRONT_END_DEVELOPMENT_JAVASCRIPT',
  MUNICH_FRONT_END_DEVELOPMENT_REACT = 'MUNICH_FRONT_END_DEVELOPMENT_REACT',
  MUNICH_UX_UI_DESIGN_BASICS = 'MUNICH_UX_UI_DESIGN_BASICS',
  MUNICH_UX_UI_DESIGN_INTERMEDIATE = 'MUNICH_UX_UI_DESIGN_INTERMEDIATE',
  MUNICH_DATA_ANALYTICS = 'MUNICH_DATA_ANALYTICS',
  MUNICH_DATA_STRUCTURE_AND_ALGORITHMS = 'MUNICH_DATA_STRUCTURE_AND_ALGORITHMS',
  MUNICH_BACK_END_DEVELOPMENT = 'MUNICH_BACK_END_DEVELOPMENT',
  MUNICH_DIGITAL_LITERACY_PROGRAM = 'MUNICH_DIGITAL_LITERACY_PROGRAM',
  MUNICH_ALUMNI = 'MUNICH_ALUMNI',
  HAMBURG_CLOUD_COMPUTING = 'HAMBURG_CLOUD_COMPUTING',
  HAMBURG_INTRO_TO_COMPUTER_SCIENCE = 'HAMBURG_INTRO_TO_COMPUTER_SCIENCE',
  HAMBURG_HTML_CSS = 'HAMBURG_HTML_CSS',
  HAMBURG_JAVASCRIPT = 'HAMBURG_JAVASCRIPT',
  HAMBURG_PYTHON_INTERMEDIATE = 'HAMBURG_PYTHON_INTERMEDIATE',
  HAMBURG_UX_UI_DESIGN_BASICS = 'HAMBURG_UX_UI_DESIGN_BASICS',
  HAMBURG_UX_UI_DESIGN_INTERMEDIATE = 'HAMBURG_UX_UI_DESIGN_INTERMEDIATE',
  HAMBURG_ALUMNI = 'HAMBURG_ALUMNI',
  CYBERSPACE_DATA_ANALYTICS = 'CYBERSPACE_DATA_ANALYTICS',
  CYBERSPACE_CYBERSECURITY_BEGINNERS = 'CYBERSPACE_CYBERSECURITY_BEGINNERS',
  CYBERSPACE_CYBERSECURITY_INTERMEDIATE = 'CYBERSPACE_CYBERSECURITY_INTERMEDIATE',
  CYBERSPACE_CYBERSECURITY_ADVANCED = 'CYBERSPACE_CYBERSECURITY_ADVANCED',
  CYBERSPACE_PYTHON_FOUNDATION = 'CYBERSPACE_PYTHON_FOUNDATION',
  CYBERSPACE_UX_UI_BASICS = 'CYBERSPACE_UX_UI_BASICS',
  CYBERSPACE_ALUMNI = 'CYBERSPACE_ALUMNI',
}
registerEnumType(RediCourse, { name: 'RediCourse' })
