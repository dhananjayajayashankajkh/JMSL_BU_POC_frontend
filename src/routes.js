import React from "react";


/*-- Import required components --*/
const Students = React.lazy(() => import("./components/pages/students/Students"));
const Classrooms = React.lazy(() => import("./components/pages/classrooms/Classrooms"));
const Teachers = React.lazy(() => import("./components/pages/teachers/Teachers"));
const Subjects = React.lazy(() => import("./components/pages/subjects/Subjects"));
const AllocateSubjects = React.lazy(() => import("./components/pages/subject_allocation/SubjectAllocation"));
const AllocateClassrooms = React.lazy(() => import("./components/pages/classroom_allocation/ClassroomAllocation"));
const StudentDetailReport = React.lazy(() => import("./components/pages/student_details/StudentDetailReport"));

const routes = [    
    { path: "/students", name: "Students", icon: "fa fa-graduation-cap", component: Students },
    { path: "/classrooms", name: "Classrooms", icon: "fa fa-building", component: Classrooms },
    { path: "/teachers", name: "Teachers", icon: "fa fa-users", component: Teachers },
    { path: "/subjects", name: "Subjects", icon: "fa fa-book", component: Subjects },
    { path: "/subjectAllocation", name: "Subject Allocation", icon: "fa fa-book", component: AllocateSubjects },
    { path: "/classroomAllocation", name: "Classroom Allocation", icon: "fa fa-book", component: AllocateClassrooms },
    { path: "/studentDetails", name: "Student Details", icon: "fa fa-book", component: StudentDetailReport },
];
export default routes;

