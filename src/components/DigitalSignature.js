"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Key, CheckCircle } from "lucide-react";

const DigitalSignature = () => {
  const [activeTab, setActiveTab] = useState("create-keys");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [files, setFiles] = useState({
    publicKey: null,
    privateKey: null,
    dataFile: null,
    hashFile: null,
    signatureFile: null,
  });

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  const handleApiRequest = async (endpoint, method = "POST", body = null) => {
    try {
      const response = await fetch(`/api/${endpoint}`, {
        method,
        body,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setStatus({ type: "success", message: data.message });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const createKeys = async () => {
    await handleApiRequest("create-keys", "POST");
  };

  const signData = async () => {
    if (!files.dataFile || !files.privateKey) {
      setStatus({
        type: "error",
        message: "Mohon upload file data dan private key terlebih dahulu.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("dataFile", files.dataFile);
    formData.append("privateKey", files.privateKey);

    await handleApiRequest("sign-data", "POST", formData);
  };

  const verifyData = async () => {
    if (!files.signatureFile || !files.publicKey || !files.hashFile) {
      setStatus({
        type: "error",
        message: "Mohon upload semua file yang diperlukan.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("signatureFile", files.signatureFile);
    formData.append("publicKey", files.publicKey);
    formData.append("hashFile", files.hashFile);

    await handleApiRequest("verify-data", "POST", formData);
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Digital Signature System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="create-keys">
                <Key className="w-4 h-4" /> Buat Kunci
              </TabsTrigger>
              <TabsTrigger value="sign-data">
                <FileText className="w-4 h-4" /> Tanda Tangan
              </TabsTrigger>
              <TabsTrigger value="verify-data">
                <CheckCircle className="w-4 h-4" /> Verifikasi
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create-keys">
              <Button onClick={createKeys} className="w-full">
                Generate Keys
              </Button>
            </TabsContent>

            <TabsContent value="sign-data">
              <Input
                type="file"
                onChange={(e) => handleFileChange(e, "dataFile")}
                placeholder="Upload Data File"
              />
              <Input
                type="file"
                onChange={(e) => handleFileChange(e, "privateKey")}
                placeholder="Upload Private Key"
              />
              <Button onClick={signData} className="w-full">
                Sign Data
              </Button>
            </TabsContent>

            <TabsContent value="verify-data">
              <Input
                type="file"
                onChange={(e) => handleFileChange(e, "signatureFile")}
                placeholder="Upload Signature File"
              />
              <Input
                type="file"
                onChange={(e) => handleFileChange(e, "publicKey")}
                placeholder="Upload Public Key"
              />
              <Input
                type="file"
                onChange={(e) => handleFileChange(e, "hashFile")}
                placeholder="Upload Hash File"
              />
              <Button onClick={verifyData} className="w-full">
                Verify Data
              </Button>
            </TabsContent>
          </Tabs>

          {status.message && (
            <Alert
              className={status.type === "error" ? "bg-red-50" : "bg-green-50"}
            >
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DigitalSignature;

