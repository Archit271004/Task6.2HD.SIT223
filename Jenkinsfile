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

        stage('Build React App') {
            steps {
                echo 'Building React App for production...'
                sh 'npm run build' // This will generate the ./build directory
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

        stage('Monitoring') {
            steps {
                script {
                    echo 'Integrating Datadog monitoring...'
                    echo 'Monitoring URL: https://hdtaskk.netlify.app'
                    echo 'Check the Datadog dashboard for live status updates.'
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up the workspace...'
            cleanWs()
        }
        failure {
            // Send an email if the build fails
            emailext (
                subject: "Build Failed - ${env.JOB_NAME}",
                body: "Build failed at ${env.BUILD_URL}. Please check the details.",
                to: 'archit7787@gmail.com'
            )

            // Optional: Send a Datadog alert on failure
            script {
                withCredentials([string(credentialsId: 'DATADOG_API_KEY', variable: 'DD_API_KEY')]) {
                    sh '''
                    curl -X POST "https://api.datadoghq.com/api/v1/events" \
                    -H "Content-Type: application/json" \
                    -H "DD-API-KEY: ${DD_API_KEY}" \
                    -d '{
                            "title": "Jenkins Build Failure Alert",
                            "text": "Jenkins job ${env.JOB_NAME} failed at ${env.BUILD_URL}",
                            "priority": "high",
                            "tags": ["project:myapp", "env:production"],
                            "alert_type": "error"
                        }'
                    '''
                }
            }
        }
    }
}
