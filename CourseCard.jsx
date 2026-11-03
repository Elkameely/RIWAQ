import { Link } from 'react-router-dom';
import { Clock, CalendarDays } from 'lucide-react';
import { formatPrice } from '../data/courses';
import { ACADEMY } from '../config';

export default function CourseCard({ course }) {
  return (
    <Link to={`/courses/${course.slug}`} className="course-card">
      <div className="course-top">
        <span className="course-word" lang="ar">{course.word}</span>
        <span className="course-level">{course.level}</span>
      </div>
      <div className="course-body">
        <h3>{course.title}</h3>
        <p className="course-ar" lang="ar">{course.arabic}</p>
        <p>{course.summary}</p>
        <ul className="course-meta">
          <li><CalendarDays size={15} /> {course.weeks} weeks, {course.perWeek} live class a week</li>
          <li><Clock size={15} /> {course.lessonCount} recorded lessons</li>
        </ul>
        <div className="course-foot">
          <strong>{formatPrice(course.price, ACADEMY.currency)}</strong>
          <span className="link-arrow">View course</span>
        </div>
      </div>
    </Link>
  );
}
