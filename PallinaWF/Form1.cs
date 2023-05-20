using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using WebSocketSharp;
using Newtonsoft.Json;

namespace PallinaWF
{
    public partial class Form1 : Form
    {
        static string URL = "wss://pallina-p5j-telegram.glitch.me";
        WebSocket wsClient = new WebSocket(URL);
        Posizione posCorrente = new Posizione();

        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {      
            wsClient.OnMessage += WsClient_OnMessage;
            wsClient.Connect();
            //wsClient.Send("Ciao da C#");
            
        }

        private void WsClient_OnMessage(object sender, MessageEventArgs e)
        {
            //MessageBox.Show(e.Data);
            try
            {
                posCorrente = JsonConvert.DeserializeObject<Posizione>(e.Data);
                //MessageBox.Show(pos.x.ToString());
                
                pe.Invalidate();
                Graphics G = pe.CreateGraphics();
                SolidBrush tratto = new SolidBrush(Color.Green);
                G.FillEllipse(tratto, posCorrente.x, posCorrente.y, 10,10);
                G.Dispose();                
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
            
        }

        private void pe_Click(object sender, EventArgs e)
        {
            //calcola la posizione x,y del mouse
            Point point = pe.PointToClient(Cursor.Position);
            //mette la posizione in un oggetto Posizione
            Posizione posToSend = new Posizione(point.X, point.Y);
            //serializza l'oggetto
            string xy = JsonConvert.SerializeObject(posToSend);
            //lo invia al server
            wsClient.Send(xy);
        }
    }
}
