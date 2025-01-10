const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topMajorSchema = new Schema({
    Major: { type: String, required: true },
    Minor: [{ type: String }],
    SkillsToImprove: [{ type: String }],
    CoursesURL: { type: String, required: true },
    OpenAIResponse: { type: String }
});

const userSchema=new Schema({
    googleId:String,
    userName:String,
    picture:String,
    displayName:String,
    dateOfJoining:Date,
    googleMail:String,
    genderType:String,
    topMajors: [topMajorSchema],
    selectedMajor: topMajorSchema,
    isAdmin: { type: Boolean, default: false }
})

mongoose.model("users",userSchema);