pipeline {
    agent any

    environment {
        REMOTE_USER = 'your-vm-user'
        REMOTE_HOST = 'your.vm.ip.address'
        SSH_CREDENTIALS_ID = 'remote-vm-ssh'
        REMOTE_APP_DIR = '/home/your-vm-user/myapp'
    }

    stages {
        stage('Clone Repo') {
            steps {
                git url: 'https://github.com/samielhosni/full-stack-dep.git', branch: 'main'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Save & Transfer Docker Images to Remote VM') {
            steps {
                script {
                    sh """
                        docker save frontend | bzip2 > frontend.tar.bz2
                        docker save backend | bzip2 > backend.tar.bz2
                    """
                }

                sshagent (credentials: [env.SSH_CREDENTIALS_ID]) {
                    sh """
                        scp frontend.tar.bz2 ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_APP_DIR}/
                        scp backend.tar.bz2 ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_APP_DIR}/
                        scp docker-compose.yml ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_APP_DIR}/
                    """
                }
            }
        }

        stage('Deploy to Remote VM') {
            steps {
                sshagent (credentials: [env.SSH_CREDENTIALS_ID]) {
                    sh """
                        ssh ${REMOTE_USER}@${REMOTE_HOST} '
                            cd ${REMOTE_APP_DIR} &&
                            bunzip2 -f frontend.tar.bz2 &&
                            bunzip2 -f backend.tar.bz2 &&
                            docker load < frontend.tar &&
                            docker load < backend.tar &&
                            docker-compose down &&
                            docker-compose up -d
                        '
                    """
                }
            }
        }
    }
}
