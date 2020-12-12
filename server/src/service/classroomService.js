import { buildClassroomDetailFromRequest, buildClassroomMember, buildClassroomAssignment } from '../models/creator/classroomDetailCreator';
import ClassroomDetail from '../models/ClassroomDetail';
import ClassroomMember from '../models/ClassroomMember';
import ClassroomStudentAssignmentAttempt from '../models/ClassroomStudentAssignmentAttempt';
import ClassroomTopic from '../models/ClassroomTopic';
import ClassroomAssignment from '../models/ClassroomAssignment';

export async function createClassroomDetail(req, res) {
  try {
    const classroomDetail = buildClassroomDetailFromRequest(req, req.user._id.toString());
    const savedClassroomDetail = await classroomDetail.save();
    await buildClassroomMember(req.user._id.toString(), savedClassroomDetail._doc.id, 'teacher' ).save();
    return res.status(200).send({ ...savedClassroomDetail._doc });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
}

export async function getClassroomGrades(req, res) {
  try {
    const grades = await ClassroomStudentAssignmentAttempt.find();
    return res.status(200).json(grades);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
}

export async function getClassroomTopics(req, res) {
  try {
    const classroomTopics = await ClassroomTopic.find({classroomId: req.params.id});
    return res.status(200).json(classroomTopics);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
}

export async function getClassroomStudentAttemptForAssignment(req, res) {
  try {
    const myAttemptForAssignment = await ClassroomStudentAssignmentAttempt.findOne({assignmentId: req.params.id, user: req.user._id.toString() });
    if(!myAttemptForAssignment) {
      return res.status(404).send();
    }
    return res.status(200).json(myAttemptForAssignment);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
}

export async function getClassroomAllAttemptsForAssignment(req, res) {
  try {
    const classroomAssignment = await ClassroomAssignment.findOne({id: req.params.id}).populate('classroomDetail');
    if(!classroomAssignment) {
      return res.status(404).send();
    }
    const classroomMemberShip = await ClassroomMember.findOne({classroomId: classroomAssignment.classroomId, user: req.user._id.toString()});
    if(classroomMemberShip.role !== 'teacher') {
      return res.status(401).send();
    }
    const allAttemptsForAssignment = await ClassroomStudentAssignmentAttempt.find({assignmentId: req.params.id});
    return res.status(200).json(allAttemptsForAssignment);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
}

export async function saveClassroomAssignmentStudentAttempt(req, res) {
  try {
    const classroom = await ClassroomDetail.findOne({id: req.body.classroomId});
    if (!classroom) {
      return res.status(404).send();
    }
    const classroomMember = await ClassroomMember.findOne({
      user: req.user._id.toString(),
      classroomId: req.body.classroomId
    });
    if(!classroomMember) {
      return res.status(404).send();
    }
    if(classroomMember.role !== "student") {
      return res.status(401).send();
    }
    const classroomAssignment = await ClassroomAssignment.findOne({id: req.body.assignmentId});
    if (!classroomAssignment) {
      return res.status(404).send();
    }
    if(classroomAssignment.type !== 'assignment') {
      return res.status(500).send({ error: 'Material cannot be attempted' });
    }
    const existingClassroomAssignmentStudentAttempt = await ClassroomStudentAssignmentAttempt.findOne({
      user: req.user._id.toString(),
      classroomId: req.body.classroomId,
      assignmentId: req.body.assignmentId,
      turnedIn: req.body.turnedIn,
    });
    if(existingClassroomAssignmentStudentAttempt) {
      return res.status(500).send({ error: 'Assignment already attempted' });
    }
    const classroomAssignmentStudentAttempt = await new ClassroomStudentAssignmentAttempt({
      user: req.user._id.toString(),
      classroomId: req.body.classroomId,
      assignmentId: req.body.assignmentId,
      myPeblUrl: req.body.myPeblUrl,
    }).save();
    return res.status(200).json(classroomAssignmentStudentAttempt);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
}

export async function changeTurnInStatusOfClassroomAssignment(req, res) {
  try {
    const classroomAssignment = await ClassroomAssignment.findOne({id: req.body.assignmentId});
    if (!classroomAssignment) {
      return res.status(404).send();
    }
    if(classroomAssignment.type !== 'assignment') {
      return res.status(500).send({ error: 'Material cannot be attempted' });
    }
    const classroomMember = await ClassroomMember.findOne({
      user: req.user._id.toString(),
      classroomId: classroomAssignment.classroomId
    });
    if(!classroomMember) {
      return res.status(404).send();
    }
    if(classroomMember.role !== "student") {
      return res.status(401).send();
    }
    const myClassroomAssignmentAttempt = await ClassroomStudentAssignmentAttempt.findOne({
      assignmentId: req.body.assignmentId,
      user: req.user._id.toString()
    });
    if (!myClassroomAssignmentAttempt) {
      return res.status(404).send();
    }
    await ClassroomStudentAssignmentAttempt.update(
      { assignmentId: req.body.assignmentId, user: req.user._id.toString() },
      {
        turnedIn: req.body.turnedIn
      });
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
}

export async function saveClassroomTopic(req, res) {
  try {
    const classroom = await ClassroomDetail.findOne({id: req.body.classroomId});
    if (!classroom) {
      return res.status(404).send();
    }
    const classroomMember = await ClassroomMember.findOne({
      user: req.user._id.toString(),
      classroomId: req.body.classroomId
    });
    if(!classroomMember) {
      return res.status(404).send();
    }
    if(classroomMember.role !== "teacher") {
      return res.status(401).send();
    }
    const classroomTopic = await new ClassroomTopic({name: req.body.name, classroomId: req.body.classroomId}).save();
    return res.status(200).json(classroomTopic);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
}

export async function saveClassroomAssignment(req, res) {
  try {
    const classroom = await ClassroomDetail.findOne({id: req.body.classroomId});
    if (!classroom) {
      return res.status(404).send();
    }
    const classroomMember = await ClassroomMember.findOne({
      user: req.user._id.toString(),
      classroomId: req.body.classroomId
    });
    if(!classroomMember) {
      return res.status(404).send();
    }
    if(classroomMember.role !== "teacher") {
      return res.status(401).send();
    }
    const classroomAssignment = buildClassroomAssignment(req);
    const savedClassroomAssignment = await classroomAssignment.save();
    return res.status(200).json(savedClassroomAssignment);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
}

export async function publishClassroomAssignment(req, res) {
  try {
    const classroomAssignment = await ClassroomAssignment.findOne({id: req.body.assignmentId});
    if (!classroomAssignment) {
      return res.status(404).send();
    }
    const classroomMember = await ClassroomMember.findOne({
      user: req.user._id.toString(),
      classroomId: classroomAssignment.classroomId
    });
    if(!classroomMember) {
      return res.status(404).send();
    }
    if(classroomMember.role !== "teacher") {
      return res.status(401).send();
    }
    await ClassroomAssignment.update(
      { id: req.body.assignmentId },
      {
        isPublished: req.body.isPublished
      });
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
}

export async function getClassroomAssignment(req, res) {
  try {
    const classroomAssignment = await ClassroomAssignment.findOne({id: req.params.id});
    return res.status(200).json(classroomAssignment);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
}

async function populateTotalStudents(classroomAssignment){
  if(classroomAssignment.type === 'material'){
    return classroomAssignment
  }
  const studentMembers = await ClassroomMember.find({
    classroomId: classroomAssignment.classroomId,
    role: 'student'
  });
  classroomAssignment.totalStudentCount = studentMembers.length;
  return classroomAssignment;
}

async function populateStudentsWhoHaveTurnedInAssignmentCount(classroomAssignment){
  if(classroomAssignment.type === 'material'){
    return classroomAssignment
  }
  const studentsWhoHaveTurnedInAssignment = await ClassroomStudentAssignmentAttempt.find({
    assignmentId: classroomAssignment.id,
    turnedIn: true
  });
  classroomAssignment.assignmentTurnedInStudentCount = studentsWhoHaveTurnedInAssignment.length;
  return classroomAssignment;
}

export async function getAllAssignmentsInClassroom(req, res) {
  try {
    const classroom = await ClassroomDetail.findOne({id: req.params.id});
    if (!classroom) {
      return res.status(404).send();
    }
    const classroomMember = await ClassroomMember.findOne({
      user: req.user._id.toString(),
      classroomId: req.params.id
    });
    if(!classroomMember) {
      return res.status(404).send();
    }
    if(classroomMember.role !== "teacher") {
      return res.status(401).send();
    }
    const classroomAssignments = await ClassroomAssignment.find({classroomId: req.params.id}).populate('topicId');
    const classroomAssignmentsJson = await Promise.all(classroomAssignments
    .map(classroomAssignment => classroomAssignment.toJSON())
    .map(classroomAssignment => {
      return {...classroomAssignment, topicId: classroomAssignment.topicId._id, topicDetail: classroomAssignment.topicId}
    })
    .map(async classroomAssignment => populateTotalStudents(await classroomAssignment))
    .map(async classroomAssignment => populateStudentsWhoHaveTurnedInAssignmentCount(await classroomAssignment)));
    return res.status(200).json(classroomAssignmentsJson);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
}

export async function getAllAssignmentsInClassroomForStudent(req, res) {
  try {
    const classroom = await ClassroomDetail.findOne({id: req.params.id});
    if (!classroom) {
      return res.status(404).send();
    }
    const classroomMember = await ClassroomMember.findOne({
      user: req.user._id.toString(),
      classroomId: req.params.id
    });
    if(!classroomMember) {
      return res.status(404).send();
    }
    if(classroomMember.role !== "student") {
      return res.status(401).send();
    }
    const assignmentsAttemptedByStudent = await ClassroomStudentAssignmentAttempt.find({classroomId: req.params.id});
    const classroomAllAssignmentsAndMaterials = await ClassroomAssignment.find({classroomId: req.params.id, isPublished: true});
    return res.status(200).json({assignmentsAttemptedByStudent, classroomAllAssignmentsAndMaterials});
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
}

export async function getAllStudentAttemptsForAssignment(req, res) {
  try {
    const classroomAssignment = (await ClassroomAssignment.findOne({id: req.params.id}).populate('topicId')).toJSON();
    if (!classroomAssignment) {
      return res.status(404).send();
    }
    const classroomMember = await ClassroomMember.findOne({
      user: req.user._id.toString(),
      classroomId: classroomAssignment.classroomId
    });
    if(!classroomMember) {
      return res.status(404).send();
    }
    if(classroomMember.role !== "teacher") {
      return res.status(401).send();
    }
    const allStudentsAttemptForAssignment = await ClassroomStudentAssignmentAttempt
    .find({assignmentId: classroomAssignment.id, turnedIn: true})
    .populate({path: 'user', select: 'name'});
    return res.status(200).json({
      allStudentsAttemptForAssignment, 
      classroomAssignment: {...classroomAssignment, topicId: classroomAssignment.topicId._id, topicDetail: classroomAssignment.topicId}
    });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
}

async function populateClassRoomStudentMemberListCount(myClassroom){
  const studentMembers = await ClassroomMember.find({
    classroomId: myClassroom.id,
    role: 'student'
  });
  myClassroom.studentMemberCount = studentMembers.length;
  return myClassroom;
}

async function populateMyMembershipInClassroomDetail(myClassroom, classroomMemberShipList){
  myClassroom.mymembership = classroomMemberShipList.filter(classroomMemberShip => classroomMemberShip.classroomId === myClassroom.id).pop();
  return myClassroom
}

export async function getAllMyClassroomDetails(req, res) {
  try {
    const classroomMemberShipList = await ClassroomMember.find({
      user: req.user._id.toString()
    });
    if(!classroomMemberShipList) {
      return res.status(404).send();
    }
    const classroomMemberShipIdList = classroomMemberShipList.map(classroomMemberShip => classroomMemberShip.classroomId);
    const myClassroomDetails = await ClassroomDetail.find().where('id').in(classroomMemberShipIdList).exec();
    
    const myClassroomDetailsWithMemberCounts = await Promise.all(myClassroomDetails
    .map(myClassroom => myClassroom.toJSON())
    .map(myClassroom => populateMyMembershipInClassroomDetail(myClassroom, classroomMemberShipList))
    .map(async myClassroom => populateClassRoomStudentMemberListCount(await myClassroom)));
    
    return res.status(200).json(myClassroomDetailsWithMemberCounts);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
}

export async function getClassroomDetail(req, res) {
  try {
    const myClassroomDetails = await ClassroomDetail.findOne({
      id: req.params.id
    });
    const members = await ClassroomMember.find({
      classroomId: req.params.id
    }).populate('userDetail', 'name');
    myClassroomDetails.members = members;
    return res.status(200).json(myClassroomDetails);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
}

export async function joinClassroom(req, res) {
  try {
    const classroom = await ClassroomDetail.findOne({id: req.params.id});
    if (!classroom) {
      return res.status(404).send();
    }
    if(classroomMember) {
      return res.status(200).send();
    }
    const classroomMember = await ClassroomMember.findOne({
      user: req.user._id.toString(),
      classroomId: req.params.id
    });
    if(classroomMember) {
      return res.status(200).send();
    }
    await buildClassroomMember(req.user._id.toString(), req.params.id, 'student' ).save();
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
}