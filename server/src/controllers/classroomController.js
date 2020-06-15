import * as classroomService from '../service/classroomService';

export function createClassroomDetail(req, res) {
  if (!req.user) {
    return res.status(403).send({ error: 'Please log in first' });
  } else {
    return classroomService.createClassroomDetail(req, res);
  }
}

export function getAllMyClassroomDetails(req, res) {
  if (!req.user) {
    return res.status(403).send({ error: 'Please log in first' });
  } else {
    return classroomService.getAllMyClassroomDetails(req, res);
  }
}

export function getClassroomDetail(req, res) {
  if (!req.user) {
    return res.status(403).send({ error: 'Please log in first' });
  } else {
    return classroomService.getClassroomDetail(req, res);
  }
}

export function joinClassroom(req, res) {
  if (!req.user) {
    return res.status(403).send({ error: 'Please log in first' });
  } else {
    return classroomService.joinClassroom(req, res);
  }
}

export function getClassroomGrades(req, res) {
  if (!req.user) {
    return res.status(403).send({ error: 'Please log in first' });
  } else {
    return classroomService.getClassroomGrades(req, res);
  }
}

export function getClassroomTopics(req, res) {
  if (!req.user) {
    return res.status(403).send({ error: 'Please log in first' });
  } else {
    return classroomService.getClassroomTopics(req, res);
  }
}

export function saveClassroomGrade(req, res) {
  if (!req.user) {
    return res.status(403).send({ error: 'Please log in first' });
  } else {
    return classroomService.saveClassroomGrade(req, res);
  }
}

export function saveClassroomTopic(req, res) {
  if (!req.user) {
    return res.status(403).send({ error: 'Please log in first' });
  } else {
    return classroomService.saveClassroomTopic(req, res);
  }
}
