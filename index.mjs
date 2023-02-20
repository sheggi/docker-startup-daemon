import { spawnSync } from 'child_process';
import { readFileSync, statSync } from 'fs';
import http from 'http'

const portsServer = listenContainerPorts(3001);
listenStatuspage(portsServer);

function listenContainerPorts(port) {
  let listenInterval = null;

  const portsServer = http.createServer(function (req, res) {
    const project = req.headers.host.split('.')[0];
    const cwd = '/Users/sheggi/tools/' + project;

    console.log(`${port}: requested ${project} at ${cwd}`)

    const abort = () => {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.write(readFileSync('./pages/404.html').toString().replace('{{HOST}}', req.headers.host));
      res.end();
    }

    try {
      if (!statSync(cwd).isDirectory()) {
        return abort()
      }
    }
    catch (e) {
      return abort()
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(readFileSync('./pages/loading.html').toString().replace('{{HOST}}', req.headers.host));
    res.end();

    if (!project) {
      console.log('no name found in host header');
      return;
    }
    
    const timeoutIntervall = () => {
      clearInterval(listenInterval);
      setTimeout(() => {
        listenInterval = setInterval(checkPorts, 1 * seconds);
      }, 30 * 1000);
    }

    timeoutIntervall();
    portsServer.close();
    startContainer(port, cwd);
  });

  const checkPorts = () => {
    if (portsServer.listening) {
      return;
    }
    portsServer.listen(port);
  }

  portsServer.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      // console.log(`${port}: container running`)
      return
    }
    console.log(`${port}: error`, err.code || err)
  });
  portsServer.on('close', () => {
    console.log(`${port}: closed`)
  });
  portsServer.on('listening', () => {
    console.log(`${port}: listening`)
  });

  const seconds = 1000;
  checkPorts();
  listenInterval = setInterval(checkPorts, 1 * seconds);

  return portsServer
}

function startContainer(port, cwd) {
  console.log(`${port}: starting dev container at: ${cwd}`);

  const container = spawnSync('docker-compose', ['up', '-d'], {
    cwd,
    stdio: 'inherit',
    shell: true,
  });

  if (container.status !== 0) {
    console.log(`${port}: oops, something went wrong, check the container status`);
    console.log(container)
  } else {
    console.log(`${port}: container started`);
  }

}

function listenStatuspage(portsServer) {
  const statusDaeomn = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(`ports listening: ${portsServer.listening}`);
    res.end();
  });
  statusDaeomn.listen(3999);
  console.log('status page at http://localhost:3999')
}