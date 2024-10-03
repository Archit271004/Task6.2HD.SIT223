pipeline {
    agent any

    environment {
        IMAGE_NAME = 'myapp/hdtask6.2'
        CONTAINER_NAME = 'myapp'
        NETLIFY_SITE_ID = '4c9e472c-bbad-4558-b6f3-d02912a59926' 
        NETLIFY_AUTH_TOKEN = credentials('nfp_tJQWcC6kBNY39JyYgzDuzheCxSqwejDvf532') 
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

                    // Stop and remove any existing container with the same name
                    sh '''
                    if [ $(docker ps -q -f name=$CONTAINER_NAME) ]; then
                        docker stop $CONTAINER_NAME && docker rm $CONTAINER_NAME
                    fi
                    '''

                    // Start the application container
                    sh 'docker run -d -p 3000:3000 --name $CONTAINER_NAME $IMAGE_NAME'
                    
                    // Install necessary packages
                    sh 'npm install selenium-webdriver'

                    // Run the Selenium tests
                    sh 'node test.js'

                    // Stop and remove the Docker container after tests
                    sh 'docker stop $CONTAINER_NAME && docker rm $CONTAINER_NAME'
                }
            }
        }

        stage('Deploy to Netlify') {
            steps {
                script {
                    echo 'Deploying to Netlify...'

                    // Install Netlify CLI
                    sh 'npm install -g netlify-cli'

                    // Deploy the site using Netlify CLI
                    sh '''
                    netlify deploy --prod --dir=build --site=$NETLIFY_SITE_ID --auth=$NETLIFY_AUTH_TOKEN
                    '''
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
