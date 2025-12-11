using Allure.NUnit;
using NUnit.Framework;

namespace Allure.Examples.NUnit3
{
    [AllureNUnit]
    public class Test
    {
        [Test]
        public void Fail()
        {
            Assert.Fail();
        }
    }
}
