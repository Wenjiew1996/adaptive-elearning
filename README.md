# AI Planning System for Adaptive E-Learning

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Installation and Configuration Setup](#installation-and-configuration-setup)
* [Usage](#usage)
* [Contact Information](#contact-information)

## General info
Proof-of-concept AI planning system for adaptive e-learning. This system was initially created by William Watson as part of an undergraduate honours thesis to fulfil a requirement for the degree of Bachelor of Engineering in Software Engineering at UNSW, and later was refined by Wenjie Wang. 
	
## Technologies
A brief high-level overview of the tech stack used in this project:

* MongoDB: 6.0.3
* Express: 4.18.2
* React: 18.2.0
* NodeJS: 19.2.0
* NextJS: 13.0.2
* Bootstrap: 5.2.2
* AWS-SDK (Amazon S3 & SES): 2.1252.0
* FF-X: [Fast-Forward Planner](https://fai.cs.uni-saarland.de/hoffmann/ff.html)

I would strongly recommend downloading a GUI for viewing the MongoDB instance. I suggest using a free version of [Studio3T](https://studio3t.com/).

Further details on the libraries and versions used can be found in the package.json file in the client and server folders.
	
## Installation and Configuration Setup
To run this project, install it by following these steps in order:

**First make sure to download [MongoDB](https://www.mongodb.com/try/download/community)**  
After the download is complete follow the setup instructions to start an instance for your specific operating system. Details of which can be found on the MongoDB site linked above.

Once MongoDB has been installed and is running, make sure to connect it to your GUI of choice (e.g. Studio3T). Ensure that the DATABASE field in server/.env matches the instance you have created. Note that you should download MongoDB for Linux system.

**Amazon Web Services**  
In order to utilise Amazon S3 for content storage and Amazon SES for mailing features the follow steps must be followed carefully:

* Create/Login a root account on Amazon Web Service Website and Open the [AWS Management Console](https://aws.amazon.com/console/)
* Using the top search bar navigate to Amazon Simple Email Service and create an identify following the instructional video on the application page
* Once you have verified the email update the EMAIL_FROM variable in server/.env
* This will be the admin email address that any user of the platform will receieve important communications from
* Now using the top search bar again, navigate to S3 and create a bucket where content uploaded through the application will be stored
* Follow the steps for creating a bucket outlined [here](https://docs.aws.amazon.com/AmazonS3/latest/userguide/creating-bucket.html)
* Make sure to update the relevant AWS fields in server/.env with the information you are provided whilst setting up the bucket. Note the secret access key must be stored and saved somewhere safe at this point.
* Once the bucket has been created, you will need to create a policy. You may use the template below replacing the <fields> with your own information:
```
{
    "Version": "2012-10-17",
    "Id": "Policy1668353125443",
    "Statement": [
        {
            "Sid": "Stmt1668353113542",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::<account-id>:user/<username>"
            },
            "Action": "s3:*",
            "Resource": "arn:aws:s3:::<bucketname>"
        },
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject",
                "s3:GetObjectVersion"
            ],
            "Resource": "arn:aws:s3:::<bucketname>/*"
        }
    ]
}
```
* If you are stuck at any point during this setup, make sure that you are entering the fields correctly as above and have updated the relevant fields in the env files.
* Note: AWS has very detailed user guides for running through any issues here so make sure to refer to them if your requirements change and you wish to update the permissions or properties of your bucket.

**When in the freshly cloned project directory 'adaptive-elearning'** 
```
$ cd client
$ npm install
$ npm run build
$ npm run dev (or if moving to production mode run $ npm start)  
```
The client will now be running on http://localhost:3000 (You may change the port from 3000 in client/server.js if desired)

**Now open another terminal and make sure you are in the 'adaptive-elearning' directory**
```
$ cd server
$ npm install
$ npm start
```
The server will now be running http://localhost:8000 (The port may be changed in server/.env if desired)

**FF-X (Fast-Forward Planner)**  
The application's AI planning capabilities are configured to run using FF-X. Note that this planner is written in C and will only run on Linux Operating Systems (Developed for **Ubuntu 20.04.5**), and some versions of Windows - it does **not** compile on any versions of MacOS. To ensure smooth running of the application please follow these steps to ensure that FF is compatabile with your OS.
Important: You don't have to run the FF Planner alone, intead, your server code will call FF planner to execute. If you still want to run it, you can type the following command (in the 'adaptive-elearning' directory)

**Whilst in the 'adaptive-elearning' directory**
```
$ cd server/FF
$ make clean
$ make
```
Now the client and server should both be running and configured for your personal environment it is time to navigate to http://localhost:3000 and interact with the application.

## Usage

A basic usage video guide for the adaptive e-learning application can be accessed [here](https://youtu.be/IcLdVCNwRqc)

Thesis Report.pdf also contains additional usage examples and instruction to be used in conjunction with the video guide.

## Contact Information
If you have any questions relating to the setup or usage of the application please send a request explaining the details of your query and what you would like my help with to and I would be happy to assist:  
The initial author of this system: William Watson - willw66@mac.com
The later refinement made by: Wenjie Wang - 1002wangwenjie@gmail.com
