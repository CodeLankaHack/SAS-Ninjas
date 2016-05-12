package io.google.ram.healthcareassistant;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.hardware.SensorManager;
import android.os.AsyncTask;
import android.os.Bundle;

import android.speech.RecognizerIntent;
import android.speech.tts.TextToSpeech;
import android.util.Log;

import android.view.Menu;
import android.view.MenuItem;
import android.view.View;

import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.jar.Attributes;

import android.hardware.Sensor;
import android.hardware.SensorManager;
import android.widget.Toast;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.StatusLine;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicHeader;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;

public class MainActivity extends Activity {
    TextToSpeech t1;
    EditText ed1;
    Button b1;
    String text;
    private final int SPEECH_RECOGNITION_CODE = 1;
    private TextView txtOutput;
    private Button btnMicrophone;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        ed1=(EditText)findViewById(R.id.editText);
        b1=(Button)findViewById(R.id.button);

        t1=new TextToSpeech(getApplicationContext(), new TextToSpeech.OnInitListener() {
            @Override
            public void onInit(int status) {
                if(status != TextToSpeech.ERROR) {
                    t1.setLanguage(Locale.US);
                    t1.setPitch(new Float(0.4));
                    t1.setSpeechRate(1);
                }
            }
        });

        b1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String toSpeak = ed1.getText().toString();
                Toast.makeText(getApplicationContext(), toSpeak, Toast.LENGTH_SHORT).show();
                t1.speak(toSpeak, TextToSpeech.QUEUE_FLUSH, null);
            }
        });

        txtOutput = (TextView) findViewById(R.id.txt_output);
        btnMicrophone = (Button) findViewById(R.id.micbtn);
        btnMicrophone.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startSpeechToText();
            }
        });
    }

    private void startSpeechToText() {
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault());
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_PROMPT,
                "Speak something...");
        try {
            startActivityForResult(intent, SPEECH_RECOGNITION_CODE);
        } catch (ActivityNotFoundException a) {
            Toast.makeText(getApplicationContext(),
                    "Sorry! Speech recognition is not supported in this device.",
                    Toast.LENGTH_SHORT).show();
        }
    }
    /**
     * Callback for speech recognition activity
     * */
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case SPEECH_RECOGNITION_CODE: {
                if (resultCode == RESULT_OK && null != data) {
                    ArrayList<String> result = data
                            .getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
                    text = result.get(0);
                    txtOutput.setText(text);

                    t1=new TextToSpeech(getApplicationContext(), new TextToSpeech.OnInitListener() {
                        @Override
                        public void onInit(int status) {
                            if(status != TextToSpeech.ERROR) {
                                t1.setLanguage(Locale.US);
                                t1.setPitch(new Float(0.4));
                                t1.setSpeechRate(1);
                                new AsyncHttpPost().execute("http://104.131.180.20:3000/diagnosis", text, "");
                            }
                        }

                    });
                }
                break;
            }
        }
    }


    public void onPause(){
        if(t1 !=null){
            t1.stop();
            t1.shutdown();
        }
        super.onPause();
    }


    class AsyncHttpPost extends AsyncTask<String, String, String> {

        private Listener mListener;


        public void setListener(Listener listener) {
            mListener = listener;
        }

        /**
         * background
         */
        @Override
        protected String doInBackground(String... params) {
            byte[] result = null;
            String str = "";
            HttpClient client = new DefaultHttpClient();
            HttpPost post = new HttpPost(params[0]);// in this case, params[0] is URL
            try {
                // set up post data
                ArrayList<NameValuePair> nameValuePair = new ArrayList<NameValuePair>();
                //Iterator<String> it = mData.keySet().iterator();
                //while (it.hasNext()) {
                //    String key = it.next();
                //    nameValuePair.add(new BasicNameValuePair(key, mData.get(key)));
                //}
                nameValuePair.add(new BasicNameValuePair("symptom", params[1]));
                Log.d("****************", params[1]);

                ArrayList<NameValuePair> nameValuePairlist = new ArrayList<NameValuePair>();
                nameValuePairlist.add(new BasicNameValuePair("symptom", params[1]));
                UrlEncodedFormEntity entity = new UrlEncodedFormEntity(nameValuePairlist);
                entity.setContentType(new BasicHeader(HTTP.CONTENT_TYPE, "application/x-www-form-urlencoded"));
                post.setEntity(entity);

                HttpResponse response = client.execute(post);
                StatusLine statusLine = response.getStatusLine();
                //if(statusLine.getStatusCode() == HttpURLConnection.HTTP_OK){
                    result = EntityUtils.toByteArray(response.getEntity());
                    str = new String(result, "UTF-8");
                    String [] ss = str.split("\"");
                    str=ss[3];
                    Log.d("****************", str);
                //}
            }
            catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            catch (Exception e) {
                e.printStackTrace();
            }
            return str;

        }

        /**
         * on getting result
         */
        @Override
        protected void onPostExecute(String result) {
            // something...
            if (mListener != null) {
                mListener.onResult(result);
            }
            Toast.makeText(MainActivity.this,result,Toast.LENGTH_SHORT).show();
            t1.speak(result, TextToSpeech.QUEUE_FLUSH, null);
        }
    }
}


interface Listener {
    void onResult(String result);
}