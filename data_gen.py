from faker import Faker
import random

fake = Faker()

majors = [
    'Computer Science', 'Finance', 'Marketing', 'Medicine', 'Law'
]

minors = [
    'Mathematics', 'Chemistry', 'Biology', 'History', 'Psychology', 
    'Sociology', 'Art', 'Music', 'Business', None
]

genders = ['Male', 'Female', 'Non-binary']
ethnicities = ['Caucasian', 'African American', 'Hispanic', 'Asian']

# Generate 100 rows of data
users_data = []

for user_id in range(1, 101):
    user_name = fake.name()
    admit_term = random.choice(['Fall 2021', 'Fall 2022', 'Fall 2023', 'Spring 2023', 'Fall 2024'])
    current_term = 'Fall 2024'
    current_major = random.choice(majors)
    hobbies = ', '.join(fake.words(nb=random.randint(1, 4)))
    minor = random.choice(minors)
    date_of_birth = fake.date_of_birth(minimum_age=18, maximum_age=25)
    gender = random.choice(genders)
    ethnicity = random.choice(ethnicities)
    gpa = round(random.uniform(2.5, 4.0), 2)
    extracurricular = ', '.join(fake.words(nb=random.randint(1, 3)))

    users_data.append((user_id, user_name, admit_term, current_term, current_major, hobbies, minor,
                       date_of_birth, gender, ethnicity, gpa, extracurricular))

# Generate SQL INSERT statements
insert_statements = "INSERT INTO Users (User_ID, UserName, AdmitTerm, CurrentTerm, CurrentMajor, Hobbies, Minor, DateOfBirth, Gender, Ethnicity, GPA, ExtracurricularActivities)\nVALUES\n"

for user in users_data:
    insert_statements += f"{user},\n"

# Remove the last comma and newline, and add a semicolon
insert_statements = insert_statements.rstrip(',\n') + ";"

print(insert_statements)
