import subprocess
import os
import sys

# Para executar basta fazer 
# python3 setup-container.py material recursos recursos.json

def generate_docker_compose(db_name, collection_name, json_file_path):
    json_file_path = os.path.abspath(json_file_path)
    docker_compose_template = f"""
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    depends_on:
      - mongo-seed
  mongo-seed:
    image: mongo:latest
    volumes:
      - {json_file_path}:/datasets/dataset.json
    command: mongoimport --host mongodb -d {db_name} -c {collection_name} --type json --file /datasets/dataset.json --jsonArray
"""
    with open("docker-compose.yml", "w") as f:
        f.write(docker_compose_template)

def start_container():
    subprocess.run(["docker-compose", "up", "-d"])

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python script.py <db_name> <collection_name> <json_file_path>")
        sys.exit(1)

    db_name = sys.argv[1]
    collection_name = sys.argv[2]
    json_file_path = sys.argv[3]
    
    generate_docker_compose(db_name, collection_name, json_file_path)
    start_container()