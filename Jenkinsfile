pipeline {
    agent any
    
    environment {
        // Define a variable for the Docker image name
        IMAGE_NAME = 'myapp/hdtask6.2'
    }
    
    stages {
        stage('Build') {
            steps {
                script {
                    // Build the Docker image
                    echo 'Building Docker image...'
                    
                    sh 'docker build -t $IMAGE_NAME .'
                    
                    // Optionally push to Docker Hub or private registry
                    // Uncomment the following if you want to push to Docker Hub
                    // sh 'docker login -u $DOCKER_USER -p $DOCKER_PASS'
                    // sh 'docker push $IMAGE_NAME'
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
