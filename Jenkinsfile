pipeline {
    agent any

    environment {
        IMAGE_NAME = 'myapp/hdtask6.2'
    }

    stages {
        stage('Build') {
            steps {
                script {
                    echo 'Building Docker image...'
                    sh 'docker build -t $IMAGE_NAME .'
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    echo 'Running Selenium tests...'

                    // Start the application container
                    sh 'docker run -d -p 3000:3000 --name myapp $IMAGE_NAME'
                    
                    // Install necessary packages
                    sh 'npm install selenium-webdriver'

                    // Run the Selenium tests using headless Chrome
                    sh 'node test.js'

                    // Stop and remove the Docker container after tests
                    sh 'docker stop myapp && docker rm myapp'
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up the workspace...'
            cleanWs()
        }
    }
}
