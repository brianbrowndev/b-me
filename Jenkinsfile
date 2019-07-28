pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building'
                chmod +x ./server/build.sh
                sh './server/build.sh'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
                chmod +x ./server/build.sh
                sh './server/deploy.sh'
            }
        }
    }
    post {
        success {
            mail to:"brbrowngeo@gmail.com", subject:"SUCCESS: ${currentBuild.fullDisplayName}", body: "Woot!"
        }
        failure {
            mail to:"brbrowngeo@gmail.com", subject:"FAILURE: ${currentBuild.fullDisplayName}", body: "Noooo.."
        }
    }   
}