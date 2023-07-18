pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                // Node.js 및 NestJS 의존성 설치
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                // NestJS 애플리케이션 빌드
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                // 테스트 실행
                sh 'npm run test'
            }
        }

        stage('Deploy') {
            steps {
                // 배포 작업 수행
                // 예: Docker 컨테이너 빌드 및 배포
            }
        }
    }

    post {
        success {
            echo 'Pipeline successfully executed!'
        }

        failure {
            echo 'Pipeline failed!'
        }
    }
}
