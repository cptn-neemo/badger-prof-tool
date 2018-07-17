async function getProfessorInformation(name) {
    const profID = await getProfessorID(name);
    const classUIDs = await getProfClasses(profID);
    const classStats = await getProfessorClassStats(classUIDs, profID);
}

/**
 * Get the professor's MadGrades id given the name 
 * 
 * @param {*String} name  name of the professor
 */
async function getProfessorID(name) {
    const config = {
        headers: {
            'Authorization': 'Token token=1b1c72ca7fe54e0cb959f2a8b0d718f6'
        },
        params: {
            query: name
        }
    }
    
    const instructorResult = await axios.get('https://api.madgrades.com/v1/instructors', config);
    //TODO: Check to see if query returned more than one instructor

    return instructorResult.data.results[0].id;
}

/**
 * Get all the classes the professor has taught
 *  
 * @param {String} id MadGrades profUID
 */
async function getProfClasses(id) {
    const config = {headers: {Authorization: 'Token token=1b1c72ca7fe54e0cb959f2a8b0d718f6'}}
    const profResult = await axios.get(`https://api.madgrades.com/v1/instructors/${id}`, config)

    const classUIDs = [];
    profResult.data.sections.forEach(section => {
        if (!classUIDs.includes(section.courseUuid))
            classUIDs.push(section.courseUuid)
    })

    return classUIDs;
}

async function getProfessorClassStats(classUIDs, profID) {
    const config = {headers: {Authorization: 'Token token=1b1c72ca7fe54e0cb959f2a8b0d718f6'}}

    const getClassGradePromises = classUIDs.map(uid => {
        return axios.get(`https://api.madgrades.com/v1/courses/${uid}/grades`, config);
    })

    const rawCourseOfferings = await Promise.all(getClassGradePromises);
    const courseOfferings = rawCourseOfferings.map(result => {
        return result.data.courseOfferings;
    });
    
    console.log(courseOfferings)


    const profClasses = [];
    const classData = courseOfferings.forEach(course => {
        course.forEach(offering => {
            offering.sections.forEach(section => {
                if (checkForProfessor(section.instructors, profID))
                    profClasses.push({
                        cumulative: offering.cumulative,
                        classData: section
                    });
            })

        })
    })

    console.log(profID, profClasses)

    return classData;
}

function checkForProfessor(instructors, profID) {
    var didTeachClass = false;
    instructors.forEach(instructorData => {
        if (instructorData.id == profID)
            didTeachClass = true;
    })
    return didTeachClass;
}