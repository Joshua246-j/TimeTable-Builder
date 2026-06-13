from pydantic import BaseModel, EmailStr


class StudentCreate(BaseModel):
    full_name: str
    email: EmailStr
    program: str


class Student(StudentCreate):
    id: str


class CourseCreate(BaseModel):
    code: str
    title: str
    credits: int = 3


class Course(CourseCreate):
    id: str


class Enrollment(BaseModel):
    id: str
    student_id: str
    course_id: str
    status: str = "active"


class EnrollmentCreate(BaseModel):
    student_id: str
    course_id: str
